import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';
import Fil from '../models/filModel.js';

const filRouter = express.Router();

filRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const fils = await Fil.find({});
    res.send(fils);
  })
);

filRouter.post(
  '/add',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newFil = new Fil({
      name: req.body.name,
    });
    try {
      const fil = await newFil.save();
      res.send({
        _id: fil._id,
        name: fil.name,
      });
    } catch (err) {
      console.log(err);
    }
  })
);

filRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const fil = await Fil.findById(req.params.id);
    if (fil) {
      await fil.remove();
      res.send({ message: 'Fil supprimé' });
    } else {
      res.status(404).send({ message: 'Fi non trouvé' });
    }
  })
);

export default filRouter;
