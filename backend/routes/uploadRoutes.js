import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { isAdmin, isAuth } from '../utils.js';
import { v4 as uuid } from 'uuid';
import sharp from 'sharp';
import path from 'path';
import mkdirp from 'mkdirp';
import fs from 'fs';

const uploadRouter = express.Router();

const __dirname = path.resolve();

uploadRouter.use('/uploads', express.static('/uploads'));

mkdirp.sync(path.join(__dirname, '/uploads/images/produits'));
mkdirp.sync(path.join(__dirname, '/uploads/images/tissus'));
mkdirp.sync(path.join(__dirname, '/uploads/images/motifs'));

const PRODUCT_PATH = path.join(__dirname, '/uploads/images/produits');
const TISSU_PATH = path.join(__dirname, '/uploads/images/tissus');
const MOTIF_PATH = path.join(__dirname, '/uploads/images/motifs');

const storage = multer.diskStorage({
  destination: (req, file, done) => {
    done(null, PRODUCT_PATH);
  },
  filename: (req, file, done) => {
    done(null, uuid() + '___' + file.originalname);
  },
});

const fileFilter = (req, file, done) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    done(null, true);
  } else {
    done(new Error('file type not supported'), false);
  }
};

const imgUpload = multer({ storage, fileFilter }).single('file');

uploadRouter.post('/product-image', (req, res) => {
  imgUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    try {
      const { file } = req;
      if (!file) {
        return res
          .status(400)
          .json({ success: false, message: 'file not supplied' });
      }
      const newFilePath = path.join(
        PRODUCT_PATH,
        uuid() + '_' + file.originalname
      );
      // save newFilePath in your db as image path
      await sharp(file.path)
        .resize({ height: 1000 })
        .jpeg({ quality: 40 })
        .toFile(newFilePath);
      fs.unlinkSync(file.path);

      return res.status(200).json({ success: true, message: 'image uploaded' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
});

uploadRouter.post('/tissu', (req, res) => {
  imgUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    try {
      const { file } = req;
      if (!file) {
        return res
          .status(400)
          .json({ success: false, message: 'file not supplied' });
      }
      const newFilePath = path.join(
        TISSU_PATH,
        uuid() + '_' + file.originalname
      );
      // save newFilePath in your db as image path
      await sharp(file.path)
        .resize({ height: 1000 })
        .jpeg({ quality: 40 })
        .toFile(newFilePath);
      fs.unlinkSync(file.path);

      return res.status(200).json({ success: true, message: 'image uploaded' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
});

uploadRouter.post('/patch', (req, res) => {
  imgUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    try {
      const { file } = req;
      if (!file) {
        return res
          .status(400)
          .json({ success: false, message: 'file not supplied' });
      }
      const newFilePath = path.join(
        MOTIF_PATH,
        uuid() + '_' + file.originalname
      );
      // save newFilePath in your db as image path
      await sharp(file.path)
        .resize({ height: 1000 })
        .jpeg({ quality: 40 })
        .toFile(newFilePath);
      fs.unlinkSync(file.path);

      return res.status(200).json({ success: true, message: 'image uploaded' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
});

export default uploadRouter;
