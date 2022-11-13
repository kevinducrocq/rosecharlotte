import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';
import Category from '../models/categoryModel.js';
import SubCategory from '../models/subCategoryModel.js';

const categoryRouter = express.Router();

const slugify = (str) =>
  str
    .toString()
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

categoryRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const categories = await SubCategory.find().populate('category');
    res.status(201).send(categories);
  })
);

// categoryRouter.get(
//   '/subCategories',
//   expressAsyncHandler(async (req, res) => {
//     const categories = await Category.find();
//     const subCategories = await subCategories.find();
//     res.send(categories, subCategories);
//   })
// );

categoryRouter.post(
  '/add',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newCategory = new Category({
      name: req.body.name,
      slug: slugify(req.body.name),
    });
    try {
      const category = await newCategory.save();
      res.send({
        _id: category._id,
        name: category.name,
        slug: category.slug,
      });
    } catch (err) {
      console.log(err);
    }
  })
);

categoryRouter.get('/:id', async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    res.send(category);
  } else {
    res.status(404).send({ message: 'Catégorie non trouvée' });
  }
});

categoryRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
      category.name = req.body.name || category.name;
      category.slug = slugify(req.body.name) || category.slug;
      const updatedCategory = await category.save();
      res.send({
        _id: updatedCategory._id,
        name: updatedCategory.name,
        slug: updatedCategory.slug,
      });
    } else {
      res.status(404).send({ message: 'Catégorie non trouvée' });
    }
  })
);

categoryRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
      await category.remove();
      res.send({ message: 'Catégorie supprimée' });
    } else {
      res.status(404).send({ message: 'Catégorie non trouvée' });
    }
  })
);

export default categoryRouter;
