import mongoose from 'mongoose';

const filSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Fil = mongoose.model('Fil', filSchema);
export default Fil;
