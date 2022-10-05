import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { isAuth, isAdmin, generateToken } from '../utils.js';
import transporter, { sender } from '../email.js';
import { contactEmail } from '../emails/ContactEmail.js';
import jwt from 'jsonwebtoken';

function capitalizeFirstLetter(string) {
  var splitStr = string.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
}

const userRouter = express.Router();
userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.address = req.body.address || user.address;
      user.zip = req.body.zip || user.zip;
      user.city = req.body.city || user.city;
      user.country = req.body.country || user.country;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: capitalizeFirstLetter(updatedUser.name),
        email: updatedUser.email,
        address: capitalizeFirstLetter(updatedUser.address),
        zip: updatedUser.zip,
        city: capitalizeFirstLetter(updatedUser.city),
        country: capitalizeFirstLetter(updatedUser.country),
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'Utilisateur non trouvé' });
    }
  })
);

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = capitalizeFirstLetter(req.body.name || user.name);
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);

      const updatedUser = await user.save();
      res.send({ message: 'Utilisateur mis à jour', user: updatedUser });
    } else {
      res.status(404).send({ message: 'Utilisateur non trouvé' });
    }
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'kducrocq.dev@gmail.com') {
        res
          .status(400)
          .send({ message: "L'administrateur ne peut pas être supprimé" });
        return;
      }
      await user.remove();
      res.send({ message: 'Utilisateur supprimé' });
    } else {
      res.status(404).send({ message: 'Utilisateur non-trouvé' });
    }
  })
);
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          address: user.address,
          zip: user.zip,
          city: user.city,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Email ou mot de passe erroné' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: capitalizeFirstLetter(user.name),
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRouter.post(
  '/contact/send',
  expressAsyncHandler(async (req, res) => {
    const senderName = req.body.senderName;
    const senderEmail = req.body.senderEmail;
    const message = req.body.message;

    const sent = await transporter.sendMail({
      from: senderEmail,
      to: 'contact@rosecharlotte.fr',
      ...contactEmail(senderName, senderEmail, message),
    });
    res.status(201).send({ message: 'message envoyé' });
  })
);

export default userRouter;
