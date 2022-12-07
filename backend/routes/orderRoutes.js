import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { isAuth, isAdmin } from '../utils.js';
import mongoose from 'mongoose';
import transporter, { sender } from '../email.js';
import { orderEmail } from '../emails/OrderEmail.js';
import { orderAdminEmail } from '../emails/OrderAdminEmail.js';
import { sentOrderEmail } from '../emails/SentOrderEmail.js';
import { chequeEmail } from '../emails/ChequeEmail.js';
import Stripe from 'stripe';
import cors from 'cors';

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

orderRouter.post('/stripe/pay', cors(), async (req, res) => {
  try {
    const { amount, id, orderId } = req.body;
    const order = await Order.findById(orderId).populate('user', 'email name');

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: round2(amount),
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: {
        name: order.user.name,
        email: order.user.email,
      },
    });
    const clientSecret = paymentIntent.client_secret;
    res.status(201).send({ clientSecret, message: 'Payment Initiated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

orderRouter.post('/stripe/check', async (req, res) => {
  const order = await Order.findById(req.body.orderId).populate(
    'user',
    'email name'
  );
  const payment = await publicStripe.paymentIntents.retrieve(
    req.body.paymentId,
    { client_secret: req.body.clientSecret },
    process.env.STRIPE_PUBLIC_KEY
  );
  if (payment.status === 'succeeded') {
    const updatedOrder = await setOrderPaid(order, res, {
      id: req.body.paymentId,
      status: payment.status,
      update_time: new Date().toISOString(),
      email_address: order.user.email,
    });
    res.status(201).send({ message: 'Paiement accepté', order: updatedOrder });
  } else {
    res.status(400).json({ message: 'Erreur lors du paiement' });
  }
});

orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([{ $sort: { createdAt: -1 } }]);
    await User.populate(orders, 'user');
    res.send(orders);
  })
);

orderRouter.get(
  '/orders-by-user',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const ordersByUsers = await Order.find({ user: req.user._id });
    res.send(ordersByUsers);
  })
);

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // tableau items avec prix
    const prices = req.body.orderItems.map((item) => {
      if (item.promoPrice > 0) {
        return item.promoPrice;
      } else if (item.soldePrice > 0) {
        return item.soldePrice;
      } else if (
        item.variant &&
        item.variant.price > 0 &&
        item.variant.promoPrice === null &&
        item.variant.soldePrice === null
      ) {
        return item.variant.price;
      } else if (
        item.variant &&
        item.variant.price > 0 &&
        item.variant.promoPrice != null &&
        item.variant.soldePrice === null
      ) {
        return item.variant.promoPrice;
      } else if (
        item.variant &&
        item.variant.price > 0 &&
        item.variant.promoPrice === null &&
        item.variant.soldePrice != null
      ) {
        return item.variant.soldePrice;
      } else {
        return item.price;
      }
    });

    const itemsPrices = prices.reduce((a, c) => a + c, 0);

    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({
        ...x,
        product: x._id,
        variant: x.variant,
      })),
      deliveryMethod: req.body.deliveryMethod,
      shippingAddress: req.body.shippingAddress,
      itemsPrice: itemsPrices,
      paymentMethod: req.body.paymentMethod,
      shippingPrice: req.body.shippingPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
      fil: req.body.fil,
      tissu: req.body.tissu,
      patch: req.body.patch,
      side: req.body.side,
    });

    const order = await newOrder.save();
    if (order.paymentMethod === 'Chèque') {
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
    res.status(201).send({ message: 'Nouvelle commande crée', order });
  })
);

orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
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
          _id: { $dateToString: { format: '%d-%m-%Y', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
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
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.send(orders);
  })
);

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'email name'
    );
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Commande non trouvée' });
    }
  })
);

orderRouter.put(
  '/:id/deliver',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      await order.save();

      const user = await User.findOne({ _id: order.user.toString() });
      await transporter.sendMail({
        from: sender,
        to: user.email,
        ...sentOrderEmail(order, user),
      });

      res.send({ message: 'Commande expédiée' });
    } else {
      res.status(404).send({ message: 'Commande non trouvée' });
    }
  })
);

orderRouter.put(
  '/:id/is-paid',
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
      res.send({ message: 'Commande payée' });
    } else {
      res.status(404).send({ message: 'Commande non trouvée' });
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    let order = await Order.findById(req.params.id).populate(
      'user',
      'email name'
    );
    if (order) {
      //Verifier avec le req.details que le paiment est valide, et est pour le bon montant
      console.log(req.body.details);

      // const updatedOrder = order;

      const updatedOrder = await setOrderPaid(order, res, {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      });

      res.send({
        message: 'Commande payée',
        order: updatedOrder,
      });
    } else {
      res.status(404).send({ message: 'Commande non trouvée' });
    }
  })
);

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.remove();
      res.send({ message: 'Commande supprimée' });
    } else {
      res.status(404).send({ message: 'Commande non trouvée' });
    }
  })
);

export default orderRouter;
