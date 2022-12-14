import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    status: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: Number, required: true },
  countInStock: { type: Number, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    images: [String],
    category: { type: String, required: true },
    categorySlug: { type: String, required: true },
    subCategory: { type: String },
    subCategorySlug: { type: String },
    otherCategory: { type: String },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    promoPrice: { type: Number },
    soldePrice: { type: Number },
    weight: { type: Number },
    countInStock: { type: Number },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    reviews: [reviewSchema],
    isVisible: { type: Boolean, required: true, default: true },
    variants: [variantSchema],
    customizable: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
