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

uploadRouter.use(
  express.static(path.join(__dirname, '../frontend/public/uploads'))
);

mkdirp.sync(path.join(__dirname, '../frontend/public/uploads'));

const UPLOAD_PATH = path.join(__dirname, '../frontend/public/uploads');

const storage = multer.diskStorage({
  destination: (req, file, done) => {
    done(null, UPLOAD_PATH);
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

const imgUpload = multer({ storage, fileFilter }).single('image');

uploadRouter.post('/file-upload', (req, res) => {
  console.log('coucou 1 ');
  imgUpload(req, res, async (err) => {
    console.log('coucou 2 ');
    if (err) {
      console.log('coucou 3 ');
      return res.status(400).json({ success: false, message: err.message });
    }
    try {
      console.log('coucou 4 ');
      const { file } = req.file;
      if (!file) {
        console.log('coucou 5 ');
        return res
          .status(400)
          .json({ success: false, message: 'file not supplied' });
      }
      const newFilePath = path.join(
        UPLOAD_PATH,
        uuid() + '_' + file.originalname
      );
      console.log('coucou 6 ');
      // save newFilePath in your db as image path
      await sharp(file.path).resize().jpeg({ quality: 50 }).toFile(newFilePath);
      console.log('coucou 7 ');
      fs.unlinkSync(file.path);
      console.log('coucou 8 ');

      return res.status(200).json({ success: true, message: 'image uploaded' });
    } catch (error) {
      console.log('coucou 9 ');
      return res.status(500).json({ success: false, message: error.message });
    }
  });
});

const upload = multer();

uploadRouter.post(
  '/',
  isAuth,
  isAdmin,
  upload.single('file'),
  async (req, res) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            quality: 50,
            height: 1000,
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    res.send(result);
  }
);

uploadRouter.post(
  '/tissu',
  isAuth,
  isAdmin,
  upload.single('file'),
  async (req, res) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_KCLOUD_NAME,
      api_key: process.env.CLOUDINARY_KAPI_KEY,
      api_secret: process.env.CLOUDINARY_KAPI_SECRET,
    });

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'tissutheque',
            quality: 50,
            height: 1000,
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    res.send(result);
  }
);

uploadRouter.post(
  '/patch',
  isAuth,
  isAdmin,
  upload.single('file'),
  async (req, res) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_KCLOUD_NAME,
      api_key: process.env.CLOUDINARY_KAPI_KEY,
      api_secret: process.env.CLOUDINARY_KAPI_SECRET,
    });

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'motiftheque',
            quality: 50,
            height: 1000,
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    res.send(result);
  }
);
export default uploadRouter;
