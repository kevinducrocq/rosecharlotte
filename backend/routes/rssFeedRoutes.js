import express from 'express';
import { Product } from '../models/productModel.js';
import dotenv from 'dotenv';
import {
  FeedBuilder,
  Product as FeedProduct,
  ProductPrice,
} from 'node-product-catalog-feed';

dotenv.config();

const rssFeedRouter = express.Router();

rssFeedRouter.get('/products.xml', async (req, res) => {
  const products = await Product.find();

  const mappedProducts = products.map((product) => {
    const feedProduct = new FeedProduct();

    feedProduct.id = product._id.toString();
    feedProduct.gtin = product._id.toString();
    feedProduct.mpn = product._id.toString();
    feedProduct.title = product.name;
    feedProduct.link = process.env.ROOT + 'product/' + product.slug;
    feedProduct.brand = 'Rose Charlotte & Compagnie';
    feedProduct.availability =
      product.countInStock > 0
        ? FeedProduct.IN_STOCK
        : FeedProduct.OUT_OF_STOCK;
    feedProduct.description = product.description.trim();
    feedProduct.imageLink = process.env.ROOT + product.image;
    feedProduct.additionalImageLink = product.images.map(
      (image) => process.env.ROOT + image
    );
    feedProduct.price = new ProductPrice(product.price, 'EUR');
    if (product.soldePrice) {
      feedProduct.salePrice = new ProductPrice(product.soldePrice, 'EUR');
    }
    feedProduct.productType = [product.category, product.subCategory];
    return feedProduct;
  });

  const xml = new FeedBuilder()
    .withTitle('Produits')
    .withLink(process.env.ROOT)
    .withDescription('Produits de Rose Charlotte & Compagnie');

  mappedProducts.forEach((product) => {
    xml.withProduct(product);
  });
  res.setHeader('content-type', 'application/rss+xml');
  res.send(xml.buildXml());
});

export default rssFeedRouter;
