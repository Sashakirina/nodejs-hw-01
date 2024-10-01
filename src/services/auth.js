import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import handlebars from 'handlebars';

import UserCollection from '../db/models/User.js';
import SessionCollection from '../db/models/Session.js';

import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/users.js';

import sendEmail from '../utils/sendMail.js';
import { env } from '../utils/env.js';
import { createJwtToken, verifyToken } from '../utils/jwt.js';
import { TEMPLATES_DIR } from '../constants/index.js';

const appDomain = env('APP_DOMAIN');

const verifyEmailTemplatePath = path.join(TEMPLATES_DIR, 'verify-email.html');

const verifyEmailTemplateSourth = await fs.readFile(
  verifyEmailTemplatePath,
  'utf-8',
);

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + accessTokenLifeTime);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifeTime);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const userSignup = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email already exist');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const data = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });

  const jwtToken = createJwtToken({ email });
  const template = handlebars.compile(verifyEmailTemplateSourth);
  const html = template({
    appDomain,
    jwtToken,
  });

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html,
  };

  await sendEmail(verifyEmail);

  return data;
};

export const verify = async (token) => {
  const { data, error } = verifyToken(token);
  if (error) {
    throw createHttpError(401, 'Token invalid');
  }
  const user = await UserCollection.findOne({ email: data.email });
  await UserCollection.findOneAndUpdate({ _id: user._id }, { verify: true });
};

export const signin = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  if (!user.verify) {
    throw createHttpError(491, 'Email not verify');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const session = createSession();

  const userSession = await SessionCollection.create({
    userId: user._id,
    ...session,
  });

  return userSession;
};

export const findSessionByAccessToken = async (accessToken) => {
  return await SessionCollection.findOne({ accessToken });
};

export const refreshUser = async ({ refreshToken, sessionId }) => {
  const oldSession = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionCollection.deleteOne({ _id: sessionId });

  const sessionData = createSession();

  const userSession = await SessionCollection.create({
    userId: oldSession._id,
    ...sessionData,
  });

  return userSession;
};

export const findUser = async (filter) => {
  return await UserCollection.findOne(filter);
};
