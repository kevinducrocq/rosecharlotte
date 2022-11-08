import express from 'express';
import { Product as Item } from '../models/productModel.js';
import dotenv from 'dotenv';
import { FeedBuilder, Product, ProductPrice } from 'node-product-catalog-feed';

dotenv.config();

const rssFeedRouter = express.Router();

rssFeedRouter.get('/products.xml', async (req, res) => {
  const products = await Item.find();

  const xml = new FeedBuilder()
    .withTitle('Produits')
    .withLink(process.env.ROOT)
    .withDescription('Produits de Rose Charlotte & Compagnie');

  products.forEach((product) => {
    
    xml.withProduct(product);
    
  });

  res.send(xml.buildXml());
});

export default rssFeedRouter;
