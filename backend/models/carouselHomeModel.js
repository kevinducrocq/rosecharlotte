import mongoose from 'mongoose';

const carouselHomeSchema = new mongoose.Schema(
  {
    firstImage: { type: String },
    firstText: { type: String },
    secondImage: { type: String },
    secondText: { type: String },
    thirdImage: { type: String },
    thirdText: { type: String },
  },
  {
    timestamps: true,
  }
);

const CarouselHome = mongoose.model('CarouselHome', carouselHomeSchema);
export default CarouselHome;
