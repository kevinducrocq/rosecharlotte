import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { isAdmin, isAuth } from '../utils.js';
import { v4 as uuid } from 'uuid';
import sharp from 'sharp';
import path from 'path';
import mkdirp from 'mkdirp';

const uploadRouter = express.Router();

const upload = multer();

const __dirname = path.resolve();

uploadRouter.use(
  express.static(path.join(__dirname, '../frontend/public/uploads'))
);

const UPLOAD_PATH = path.join(__dirname, '../frontend/public/uploads');

mkdirp.sync(path.join(__dirname, '/uploads'));

const storage = multer.diskStorage({
  destination: (req, file, done) => {
    done(null, UPLOAD_PATH);
  },
  filename: (req, file, done) => {
    done(null, uuid() + '___' + file.originalname);
  },
});

const limits = {
  fileSize: 5 * 1024 * 1024,
};

const fileFilter = (req, file, done) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    done(null, true);
  } else {
    done(new Error('file type not supported'), false);
  }
};

const imgUpload = multer({ storage, limits, fileFilter }).single('image');

uploadRouter.post('/file-upload', (req, res) => {
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
        UPLOAD_PATH,
        uuid() + '_' + file.originalname
      );
      // save newFilePath in your db as image path
      await sharp(file.path).resize().jpeg({ quality: 50 }).toFile(newFilePath);
      fs.unlinkSync(file.path);

      return res.status(200).json({ success: true, message: 'image uploaded' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
});

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
