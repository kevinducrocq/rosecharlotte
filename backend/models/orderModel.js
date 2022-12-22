import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: Number, required: true },
  price: { type: Number },
  promoPrice: { type: Number },
  soldePrice: { type: Number },
});

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        slug: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number },
        promoPrice: { type: Number },
        soldePrice: { type: Number },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        customization: { type: String },
        fil: { type: String },
        tissu: { type: String },
        patch: { type: String },
        variant: variantSchema,
        side: { type: String },
      },
    ],
    deliveryMethod: { type: String, required: true },
    shippingAddress: {
      name: { type: String },
      address: { type: String },
      zip: { type: String },
      city: { type: String },
      country: { type: String },
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    paymentMethod: { type: String, required: true },
    itemsPrice: { type: Number, required: true },
    discount: { type: Number },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    trackNumber: { type: String },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
