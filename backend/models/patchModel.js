import mongoose from 'mongoose';

const patchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const Patch = mongoose.model('Patch', patchSchema);
export default Patch;
