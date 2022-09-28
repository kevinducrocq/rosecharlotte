import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'ni-web-01.srv.nihost.fr',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER, // generated ethereal user
    pass: process.env.MAIL_PASSWORD, // generated ethereal password
  },
});

export const sender = process.env.MAIL_USER;

export default transporter;
