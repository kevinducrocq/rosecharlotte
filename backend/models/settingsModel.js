import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    chosenCategory: { type: String },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
