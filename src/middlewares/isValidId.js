import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId = (req, res, next) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) {
    return next(createHttpError(400, 'Bad Request'));
  }

  next();
};
