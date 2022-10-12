import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';
import Patch from '../models/patchModel.js';

const patchRouter = express.Router();

patchRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const patches = await Patch.find({});
    res.send(patches);
  })
);

patchRouter.post(
  '/add',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newPatch = new Patch({
      name: req.body.name,
    });
    try {
      const patch = await newPatch.save();
      res.send({
        _id: patch._id,
        name: patch.name,
      });
    } catch (err) {
      console.log(err);
    }
  })
);

patchRouter.get('/:id', async (req, res) => {
  const patch = await Patch.findById(req.params.id);
  if (patch) {
    res.send(patch);
  } else {
    res.status(404).send({ message: 'Motif broderie non trouvé' });
  }
});

patchRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const patch = await Patch.findById(req.params.id);
    if (patch) {
      patch.name = req.body.name || patch.name;
      patch.image = req.body.image || patch.image;
      const updatedPatch = await patch.save();
      res.send({
        _id: updatedPatch._id,
        name: updatedPatch.name,
        image: updatedPatch.image,
      });
    } else {
      res.status(404).send({ message: 'Modtif broderie non trouvé' });
    }
  })
);

patchRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const patch = await Patch.findById(req.params.id);
    if (patch) {
      await patch.remove();
      res.send({ message: 'Patch supprimé' });
    } else {
      res.status(404).send({ message: 'Patch non trouvé' });
    }
  })
);

export default patchRouter;
