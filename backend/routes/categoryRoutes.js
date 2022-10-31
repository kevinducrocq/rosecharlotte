import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';
import Category from '../models/categoryModel.js';

const categoryRouter = express.Router();

categoryRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.send(categories);
  })
);

categoryRouter.post(
  '/add',
  expressAsyncHandler(async (req, res) => {
    const newCategory = new Category({
      name: req.body.name,
    });
    try {
      const category = await newCategory.save();
      res.send({
        _id: category._id,
        name: category.name,
      });
    } catch (err) {
      console.log(err);
    }
  })
);

categoryRouter.delete(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
      await category.remove();
      res.send({ message: 'Categorie supprimée' });
    } else {
      res.status(404).send({ message: 'Catégorie non trouvée' });
    }
  })
);

export default categoryRouter;
