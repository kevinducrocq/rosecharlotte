import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  }
);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: Boolean, required: true, default: true },
    subcategories: [subCategorySchema],
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', categorySchema);
export default Category;
