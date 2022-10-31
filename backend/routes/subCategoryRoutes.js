import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';
import SubCategory from '../models/subCategoryModel.js';

const subCategoryRouter = express.Router();

subCategoryRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const subCategories = await SubCategory.find({});
    res.send(subCategories);
  })
);

subCategoryRouter.post(
  '/add',
  expressAsyncHandler(async (req, res) => {
    const newSubCategory = new SubCategory({
      name: req.body.name,
    });
    try {
      const subCategory = await newSubCategory.save();
      res.send({
        _id: subCategory._id,
        name: subCategory.name,
      });
    } catch (err) {
      console.log(err);
    }
  })
);

subCategoryRouter.delete(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const subCategory = await SubCategory.findById(req.params.id);
    if (subCategory) {
      await subCategory.remove();
      res.send({ message: 'Sous-catégorie supprimée' });
    } else {
      res.status(404).send({ message: 'Sous-catégorie non trouvée' });
    }
  })
);

export default subCategoryRouter;
