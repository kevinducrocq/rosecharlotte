import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import filRouter from './routes/filRoutes.js';
import tissuRouter from './routes/tissuRoutes.js';
import patchRouter from './routes/patchRoutes.js';
import settingsRouter from './routes/settingsRoutes.js';
import sitemapRouter from './routes/sitemapRoutes.js';
import rssFeedRouter from './routes/rssFeedRoutes.js';
import mondialRelayRouter from './routes/mondialRelayRoutes.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI_ATLAS)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(express.json({ limit: '100mb', extended: true }));
app.use(
  express.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 })
);

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

app.use('/api/fils', filRouter);
app.use('/api/tissus', tissuRouter);
app.use('/api/patches', patchRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/products', productRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/sitemap', sitemapRouter);
app.use('/api/rss', rssFeedRouter);
app.use('/api/mondialRelay', mondialRelayRouter);

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(express.static(path.join(__dirname, '/uploads')));

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
);

// app.get('/sitemap', (req, res) =>
//   res.sendFile(path.join(__dirname, '../frontend/public/sitemap.xml'))
// );

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
