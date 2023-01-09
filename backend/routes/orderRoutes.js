import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import { isAuth, isAdmin } from "../utils.js";
import mongoose from "mongoose";
import transporter, { sender } from "../email.js";
import { orderEmail } from "../emails/OrderEmail.js";
import { orderAdminEmail } from "../emails/OrderAdminEmail.js";
import { sentOrderEmail } from "../emails/SentOrderEmail.js";
import { chequeEmail } from "../emails/ChequeEmail.js";
import Stripe from "stripe";
import cors from "cors";
import fs from "fs";
import Twig from "twig";
import puppeteer from "puppeteer";
import html_to_pdf from "html-pdf-node";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const publicStripe = new Stripe(process.env.STRIPE_PUBLIC_KEY);

const orderRouter = express.Router();
orderRouter.use(cors());

const setOrderPaid = async (order, res, paymentResult) => {
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = paymentResult;

  const user = await User.findOne({
    _id: order.user?._id?.toString() ?? order.user.toString(),
  });
  await transporter.sendMail({
    from: sender,
    to: user.email,
    ...orderEmail(order, user),
  });
  await transporter.sendMail({
    from: sender,
    to: sender,
    ...orderAdminEmail(order, user),
  });

  updateStock(order);

  return await order.save();
};

const updateStock = async (order) => {
  const { orderItems } = order;
  for (let orderItem of orderItems) {
    const product = await Product.findOne({ _id: orderItem._id });
    if (orderItem.variant) {
      const variants = product.variants.map((variant) => {
        if (variant._id.toString() === orderItem.variant._id.toString()) {
          variant.countInStock = variant.countInStock - orderItem.quantity;
        }
        return variant;
      });

      const modifiedProductVariant = await Product.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(orderItem.product) },
        {
          variants: variants,
        }
      );
    } else {
      const modifiedProduct = await Product.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(orderItem.product) },
        { countInStock: product.countInStock - orderItem.quantity }
      );
    }
  }
};

orderRouter.post("/stripe/pay", cors(), async (req, res) => {
  try {
    const { amount, id, orderId } = req.body;
    const order = await Order.findById(orderId).populate("user", "email name");

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: round2(amount),
      currency: "eur",
      payment_method_types: ["card"],
      metadata: {
        name: order.user.name,
        email: order.user.email,
      },
    });
    const clientSecret = paymentIntent.client_secret;
    res.status(201).send({ clientSecret, message: "Payment Initiated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

orderRouter.post("/stripe/check", async (req, res) => {
  const order = await Order.findById(req.body.orderId).populate(
    "user",
    "email name"
  );
  const payment = await publicStripe.paymentIntents.retrieve(
    req.body.paymentId,
    { client_secret: req.body.clientSecret },
    process.env.STRIPE_PUBLIC_KEY
  );
  if (payment.status === "succeeded") {
    const updatedOrder = await setOrderPaid(order, res, {
      id: req.body.paymentId,
      status: payment.status,
      update_time: new Date().toISOString(),
      email_address: order.user.email,
    });
    res.status(201).send({ message: "Paiement accepté", order: updatedOrder });
  } else {
    res.status(400).json({ message: "Erreur lors du paiement" });
  }
});

orderRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([{ $sort: { createdAt: -1 } }]);
    await User.populate(orders, "user");
    res.send(orders);
  })
);

orderRouter.get(
  "/orders-by-user",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const ordersByUsers = await Order.find({ user: req.user._id });
    res.send(ordersByUsers);
  })
);

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // retourne les prix en fonction des variants, des promos, des soldes
    const prices = req.body.orderItems.map((item) => {
      if (item.promoPrice > 0) {
        return item.promoPrice * item.quantity;
      } else if (item.soldePrice > 0) {
        return item.soldePrice * item.quantity;
      } else if (
        item.variant &&
        item.variant.price > 0 &&
        item.variant.promoPrice === null &&
        item.variant.soldePrice === null
      ) {
        return item.variant.price * item.quantity;
      } else if (
        item.variant &&
        item.variant.price > 0 &&
        item.variant.promoPrice != null &&
        item.variant.soldePrice === null
      ) {
        return item.variant.promoPrice * item.quantity;
      } else if (
        item.variant &&
        item.variant.price > 0 &&
        item.variant.promoPrice === null &&
        item.variant.soldePrice != null
      ) {
        return item.variant.soldePrice * item.quantity;
      } else {
        return item.price * item.quantity;
      }
    });
    const itemsPrices = prices.reduce((a, c) => a + c, 0);

    // Poids total du panier
    const totalCartWeight = req.body.orderItems.reduce((weight, item) => {
      if (item.variant) {
        return weight + item.quantity * item.variant.weight;
      }
      return weight + item.quantity * item.weight;
    }, 0);

    // Nombre de commandes de l'utilisateur
    const ordersByUsers = await Order.find({
      user: req.user._id,
      isPaid: true,
    }).countDocuments();

    let discount = 0;
    // Si 1ère commande, alors remise
    if (ordersByUsers === 0) {
      discount = 0;
    }

    // Prix de livraison
    const deliveryPrice = () => {
      if (req.body.deliveryMethod === "Local") {
        return 0;
      }
      if (req.body.deliveryMethod === "Domicile") {
        if (totalCartWeight <= 200 && itemsPrices < 99) {
          return 4.4;
        } else if (
          totalCartWeight >= 200 &&
          totalCartWeight <= 250 &&
          itemsPrices < 99
        ) {
          return 5.4;
        } else if (totalCartWeight >= 250 && itemsPrices < 99) {
          return 6.9;
        } else if (itemsPrices >= 99) {
          return 0;
        }
      }

      if (req.body.deliveryMethod === "Mondial Relay") {
        if (totalCartWeight <= 500 && itemsPrices < 100) {
          return 4.4;
        } else if (
          totalCartWeight >= 500 &&
          totalCartWeight <= 1000 &&
          itemsPrices < 100
        ) {
          return 4.9;
        } else if (
          totalCartWeight >= 1000 &&
          totalCartWeight <= 1500 &&
          itemsPrices < 100
        ) {
          return 6.4;
        } else if (itemsPrices >= 100 || totalCartWeight > 1500) {
          return 0;
        }
      }
    };

    // Total
    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

    const total = round2(
      ((itemsPrices + deliveryPrice()) * (100 - discount)) / 100
    );

    const newOrder = new Order({
      orderItems: req.body.orderItems.map((item) => ({
        ...item,
        product: item._id,
        variant: item.variant,
      })),
      deliveryMethod: req.body.deliveryMethod,
      shippingAddress: req.body.shippingAddress,
      itemsPrice: itemsPrices,
      paymentMethod: req.body.paymentMethod,
      shippingPrice: deliveryPrice(),
      discount: discount,
      totalPrice: total,
      user: req.user._id,
      fil: req.body.fil,
      tissu: req.body.tissu,
      patch: req.body.patch,
      side: req.body.side,
    });

    const order = await newOrder.save();
    if (order.paymentMethod === "Chèque") {
      await transporter.sendMail({
        from: sender,
        to: req.user.email,
        ...orderEmail(order, req.user),
      });
      await transporter.sendMail({
        from: sender,
        to: sender,
        ...orderAdminEmail(order, req.user),
      });
      updateStock(order);
    }
    res.status(201).send({ message: "Nouvelle commande crée", order });
  })
);

orderRouter.get(
  "/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const products = await Product.aggregate([
      {
        $group: {
          _id: null,
          numProducts: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    res.send({
      users,
      orders,
      products,
      dailyOrders,
      productCategories,
    });
  })
);

orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.send(orders);
  })
);

const generateHtml = async (req, res, callback) => {
  let order = await Order.findById(req.params.id).populate("user");

  const orderRealPrices = order.orderItems.map((item) => {
    return item.promoPrice ||
      item.soldePrice ||
      item.variant?.promoPrice ||
      item.variant?.soldePrice
      ? (item.promoPrice ?? item.soldePrice) ||
          (item.variant?.promoPrice ?? item.variant?.soldePrice)
      : item.price || item.variant.price;
  });

  if (order) {
    try {
      Twig.renderFile(
        "./factures/facture.html.twig",
        { order: order, orderRealPrices: orderRealPrices },
        (err, html) => {
          callback(html);
        }
      );
    } catch (err) {
      res
        .status(500)
        .send({ message: "Erreur lors de la génération de la facture" });
    }
  } else {
    res.status(404).send({ message: "Commande non trouvée" });
  }
};

orderRouter.get(
  "/mine/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    generateHtml(req, res, (html) => {
      let file = { content: html };
      let options = { format: "A4", printBackground: true };
      html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
        res.send(pdfBuffer);
      });
    });
  })
);

orderRouter.get(
  "/mine/:id/view",
  expressAsyncHandler(async (req, res) => {
    generateHtml(req, res, (html) => {
      res.send(html);
    });
  })
);

orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "email name"
    );
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Commande non trouvée" });
    }
  })
);

orderRouter.get(
  "invoice/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user");
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Commande non trouvée" });
    }
  })
);

orderRouter.put(
  "/:id/deliver",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.trackNumber = req.body.trackNumber;

      await order.save();

      const user = await User.findOne({ _id: order.user.toString() });
      await transporter.sendMail({
        from: sender,
        to: user.email,
        ...sentOrderEmail(order, user),
      });

      res.send({ message: "Commande expédiée" });
    } else {
      res.status(404).send({ message: "Commande non trouvée" });
    }
  })
);

orderRouter.put(
  "/:id/is-paid",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    const user = await User.findOne({
      _id: order.user?._id?.toString() ?? order.user.toString(),
    });
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();

      await order.save();
      await transporter.sendMail({
        from: sender,
        to: user.email,
        ...chequeEmail(order, user),
      });
      res.send({ message: "Commande payée" });
    } else {
      res.status(404).send({ message: "Commande non trouvée" });
    }
  })
);

orderRouter.put(
  "/:id/pay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    let order = await Order.findById(req.params.id).populate(
      "user",
      "email name"
    );
    if (order) {
      //Verifier avec le req.details que le paiment est valide, et est pour le bon montant
      // console.log(req.body.details);

      // const updatedOrder = order;

      const updatedOrder = await setOrderPaid(order, res, {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      });

      res.send({
        message: "Commande payée",
        order: updatedOrder,
      });
    } else {
      res.status(404).send({ message: "Commande non trouvée" });
    }
  })
);

orderRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.remove();
      res.send({ message: "Commande supprimée" });
    } else {
      res.status(404).send({ message: "Commande non trouvée" });
    }
  })
);

export default orderRouter;
