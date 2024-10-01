import * as authService from '../services/auth.js';

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: new Date(Date.now() + session.refreshTokenValidUntil),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: new Date(Date.now() + session.refreshTokenValidUntil),
  });
};

export const signupController = async (req, res) => {
  const newUser = await authService.userSignup(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully register user!',
    data: newUser,
  });
};

export const verifyController = async (req, res) => {
  const { token } = req.query;
  await authService.verify(token);

  res.json({
    status: 200,
    message: 'Successfully verified email',
    data: {},
  });
};

export const siginController = async (req, res) => {
  const session = await authService.signin(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully signin',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;

  const session = await authService.refreshUser({ refreshToken, sessionId });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refresh session',
    data: {
      accessToken: session.accessToken,
    },
  });
};
