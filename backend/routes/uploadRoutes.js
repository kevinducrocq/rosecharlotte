import express from "express";
import multer from "multer";
import { v4 as uuid } from "uuid";
import sharp from "sharp";
import path from "path";
import mkdirp from "mkdirp";
import fs from "fs";

const uploadRouter = express.Router();

const __dirname = path.resolve();

mkdirp.sync(path.join(__dirname, "/uploads"));

uploadRouter.use("/uploads", express.static("/uploads"));

const FILE_DIR = path.join(__dirname, "/uploads");

const storage = multer.diskStorage({
  destination: (req, file, done) => {
    done(null, FILE_DIR);
  },
  filename: (req, file, done) => {
    done(
      null,
      uuid() + "_" + file.originalname.toLocaleLowerCase().split(" ").join("-")
    );
  },
});

const fileFilter = (req, file, done) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype == "image/jpg"
  ) {
    done(null, true);
  } else {
    done(new Error("file type not supported"), false);
  }
};

const imgUpload = multer({ storage, fileFilter }).single("file");

uploadRouter.post("/image", (req, res) => {
  imgUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    try {
      const { file } = req;
      if (!file) {
        return res
          .status(400)
          .json({ success: false, message: "file not supplied" });
      }
      const newFileName =
        uuid() +
        "_" +
        file.originalname.toLocaleLowerCase().split(" ").join("-");
      const newFilePath = path.join(FILE_DIR, newFileName);

      // save newFilePath in your db as image path
      await sharp(file.path)
        .resize({ height: 1000 })
        .withMetadata()
        .jpeg({ quality: 70 })
        .toFile(newFilePath);
      fs.unlinkSync(file.path);

      return res.status(200).json({
        success: true,
        message: "image uploaded",
        path: "/" + newFileName,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
});

export default uploadRouter;
