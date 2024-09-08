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

const moviesRouter = Router();

moviesRouter.get('/', ctrlWrapper(getMoviesController));

moviesRouter.get('/:movieId', ctrlWrapper(getMovieByIdController));

moviesRouter.post('/', ctrlWrapper(addMovieController));

moviesRouter.put('/:movieId', ctrlWrapper(upsertMovieController));

moviesRouter.patch('/:movieId', ctrlWrapper(patchMovieController));

moviesRouter.delete('/:movieId', ctrlWrapper(deleteMovieController));

export default moviesRouter;
