import * as authService from '../services/auth.js';

export const signupController = async (req, res) => {
  const newUser = await authService.userSignup(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully register user!',
    data: newUser,
  });
};

export const siginController = async (req, res) => {
  const session = await authService.signin(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: new Date(Date.now() + session.refreshTokenValidUntil),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: new Date(Date.now() + session.refreshTokenValidUntil),
  });

  res.json({
    status: 200,
    message: 'Successfully signin',
    data: {
      accessToken: session.accessToken,
    },
  });
};
