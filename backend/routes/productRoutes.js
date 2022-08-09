import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { isAuth, isAdmin } from '../utils.js';

const productRouter = express.Router();

const slugify = (str) =>
  str
    .toString()
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

// RECUPERER TOUS LES PRODUITS
productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

// AJOUTER UN PRODUIT
productRouter.post(
  '/add',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      name: req.body.name,
      slug: slugify(req.body.name),
      price: req.body.price,
      weight: req.body.weight,
      image: req.body.image,
      images: req.body.images,
      category: req.body.category,
      countInStock: req.body.countInStock,
      numReviews: 0,
      rating: 0,
      description: req.body.description,
    });
    const product = await newProduct.save();
    res.send({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      weight: product.weight,
      image: product.image,
      images: product.images,
      category: product.category,
      countInStock: product.countInStock,
      numReviews: 0,
      rating: 0,
      description: product.description,
    });
  })
);

// METTRE A JOUR UN PRODUIT
productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name || product.name;
      product.slug = req.body.slug || product.slug;
      product.price = req.body.price || product.price;
      product.weight = req.body.weight || product.weight;
      product.image = req.body.image || product.image;
      product.images = req.body.images || product.images;
      product.category = req.body.category || product.category;
      product.brand = req.body.brand || product.brand;
      product.countInStock = req.body.countInStock || product.countInStock;
      product.description = req.body.description || product.description;

      const updatedProduct = await product.save();
      res.send({
        _id: updatedProduct._id,
        name: updatedProduct.name,
        slug: updatedProduct.slug,
        price: updatedProduct.price,
        weight: updatedProduct.weight,
        image: updatedProduct.image,
        images: updatedProduct.images,
        category: updatedProduct.category,
        brand: updatedProduct.brand,
        countInStock: updatedProduct.countInStock,
        description: updatedProduct.description,
      });
    } else {
      res.status(404).send({ message: 'Produit non trouvé' });
    }
  })
);

// SUPPRIMER UN PRODUIT
productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.send({ message: 'Produit supprimé' });
    } else {
      res.status(404).send({ message: 'Produit non trouvé' });
    }
  })
);

// POSTER UN AVIS
productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'Vous avez déjà laissé un commentaire' });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
        status: false,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: 'Avis créé',
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: 'Pas de résultat' });
    }
  })
);

// AFFICHER LE NOMBRE TOTAL DE PRODUIT SUR LE TABLEAU DE BORD
const PAGE_SIZE = 5;

productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

// PAGE BOUTIQUE
productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};

    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

// RECUPERER TOUTES LES CATEGORIES DES PRODUITS
productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);

// RECUPERER TOUS LES COMMENTAIRES DES PRODUITS
productRouter.get(
  '/reviews',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find();
    let reviews = [];
    products.forEach((product) => {
      product.reviews.forEach((review) => {
        reviews.push({ ...review._doc, product: product });
      });
    });
    console.log('Reviews : ', reviews);
    res.send(reviews);
  })
);

// AFFICHER LE PRODUIT PAR SON SLUG (CLIENT)
productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

// AFFICHER LE PRODUIT PAR SON ID (ADMIN)
productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

export default productRouter;
