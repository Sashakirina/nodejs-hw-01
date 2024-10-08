import { Router } from 'express';
import {
  addMovieController,
  deleteMovieController,
  getMovieByIdController,
  getMoviesController,
  patchMovieController,
  upsertMovieController,
} from '../controllers/movies.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import { movieAddSchema, movieUpdateSchema } from '../validation/movie.js';
import { isValidId } from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const moviesRouter = Router();

moviesRouter.use(authenticate);

moviesRouter.get('/', ctrlWrapper(getMoviesController));

moviesRouter.get('/:movieId', isValidId, ctrlWrapper(getMovieByIdController));

moviesRouter.post(
  '/',
  upload.single('poster'),
  validateBody(movieAddSchema),
  ctrlWrapper(addMovieController),
);

moviesRouter.put('/:movieId', isValidId, ctrlWrapper(upsertMovieController));

moviesRouter.patch(
  '/:movieId',
  isValidId,
  validateBody(movieUpdateSchema),
  ctrlWrapper(patchMovieController),
);

moviesRouter.delete('/:movieId', isValidId, ctrlWrapper(deleteMovieController));

export default moviesRouter;
