import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import CarouselHome from '../models/carouselHomeModel.js';
import { isAuth, isAdmin } from '../utils.js';

const settingsRouter = express.Router();

settingsRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const carouselHome = await CarouselHome.find();
    res.send(carouselHome);
  })
);

// settingsRouter.post(
//   '/add-carousel',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const newCarouselHome = new CarouselHome({
//       firstImage: req.body.firstImage,
//       firstText: req.body.firstText,
//       secondImage: req.body.secondImage,
//       secondText: req.body.secondText,
//       thirdImage: req.body.thirdImage,
//       thirdText: req.body.thirdText,
//     });
//     try {
//       const carouselHome = await newCarouselHome.save();
//       res.send({
//         _id: carouselHome._id,
//         firstImage: carouselHome.firstImage,
//         firstText: carouselHome.firstText,
//         secondImage: carouselHome.secondImage,
//         secondText: carouselHome.secondText,
//         thirdImage: carouselHome.thirdImage,
//         thirdText: carouselHome.thirdText,
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   })
// );

settingsRouter.get('/:id', async (req, res) => {
  const carouselHome = await CarouselHome.findById(req.params.id);
  if (carouselHome) {
    res.send(carouselHome);
  } else {
    res.status(404).send({ message: 'Carousel non trouvé' });
  }
});

settingsRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const carouselHome = await CarouselHome.findById(req.params.id);
    if (carouselHome) {
      carouselHome.firstImage = req.body.firstImage || carouselHome.firstImage;
      carouselHome.firstText = req.body.firstText || carouselHome.firstText;
      carouselHome.secondImage =
        req.body.secondImage || carouselHome.secondImage;
      carouselHome.secondText = req.body.secondText || carouselHome.secondText;
      carouselHome.thirdImage = req.body.thirdImage || carouselHome.thirdImage;
      carouselHome.thirdText = req.body.thirdText || carouselHome.thirdText;
      const updatedCarouselHome = await carouselHome.save();
      res.send({
        _id: updatedCarouselHome._id,
        firstImage: updatedCarouselHome.firstImage,
        firstText: updatedCarouselHome.firstText,
        secondImage: updatedCarouselHome.secondImage,
        secondText: updatedCarouselHome.secondText,
        thirdImage: updatedCarouselHome.thirdImage,
        thirdText: updatedCarouselHome.thirdText,
      });
    } else {
      res.status(404).send({ message: 'Carousel non trouvé' });
    }
  })
);

export default settingsRouter;
