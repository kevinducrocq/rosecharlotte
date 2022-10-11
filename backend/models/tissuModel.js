import mongoose from 'mongoose';

const tissuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const Tissu = mongoose.model('Tissu', tissuSchema);
export default Tissu;
