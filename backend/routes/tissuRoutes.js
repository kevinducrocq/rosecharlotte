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
    });
    try {
      const tissu = await newTissu.save();
      res.send({
        _id: tissu._id,
        name: tissu.name,
      });
    } catch (err) {
      console.log(err);
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
