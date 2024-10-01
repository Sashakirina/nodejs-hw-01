import nodemailer from 'nodemailer';
import 'dotenv/config';

const { SMTP_SERVER, SMTP_PORT, SMTP_LOGIN, SMTP_FROM, SMTP_PASSWORD } =
  process.env;

const nodemailerConfig = {
  host: SMTP_SERVER,
  port: SMTP_PORT,
  auth: {
    user: SMTP_LOGIN,
    pass: SMTP_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = (data) => {
  const email = { ...data, from: SMTP_FROM };
  return transport.sendMail(email);
};

export default sendEmail;
