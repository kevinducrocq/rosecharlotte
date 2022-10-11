import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';
import Tissu from '../models/tissuModel.js';

const tissuRouter = express.Router();

tissuRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const tissus = await Tissu.find({});
    res.send(tissus);
  })
);

tissuRouter.post(
  '/add',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newTissu = new Tissu({
      name: req.body.name,
      image: req.body.image,
    });
    try {
      const tissu = await newTissu.save();
      res.send({
        _id: tissu._id,
        name: tissu.name,
        image: tissu.image,
      });
    } catch (err) {
      console.log(err);
    }
  })
);

tissuRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const tissuId = req.params.id;
    const tissu = await Tissu.findById(tissuId);
    if (tissu) {
      tissu.name = req.body.name || tissu.name;
      tissu.image = req.body.image || tissu.image;
      const updatedTissu = await tissu.save();
      res.send({
        _id: updatedTissu._id,
        name: updatedTissu.name,
        image: updatedTissu.image,
      });
    } else {
      res.status(404).send({ message: 'Tissu non trouvé' });
    }
  })
);

tissuRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const tissu = await Tissu.findById(req.params.id);
    if (tissu) {
      await tissu.remove();
      res.send({ message: 'Tissu supprimé' });
    } else {
      res.status(404).send({ message: 'Tissu non trouvé' });
    }
  })
);

export default tissuRouter;
