import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    chosenCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
