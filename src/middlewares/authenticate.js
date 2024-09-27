import createHttpError from 'http-errors';
import * as authService from '../services/auth.js';

const authenticate = async (req, res, next) => {
  const authorization = req.get('Authorization');

  if (!authorization) {
    return next(createHttpError(401, 'Authorization header not found'));
  }

  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer') {
    return next(
      createHttpError(401, 'Authorization token must be bearer type'),
    );
  }

  const session = await authService.findSessionByAccessToken(token);

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  if (new Date() > session.accessTokenValidUntil) {
    return next(createHttpError(401, 'Accesstoken expired'));
  }

  const user = await authService.findUser({ _id: session.userId });

  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;

  next();
};

export default authenticate;
