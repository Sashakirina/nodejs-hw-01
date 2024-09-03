import * as movieServisces from '../services/movies.js';
import createHttpError from 'http-errors';

export const getMoviesController = async (req, res) => {
  const movies = await movieServisces.getAllMovies();

  res.json({
    status: 200,
    message: 'All movies found',
    data: movies,
  });
};

export const getMovieByIdController = async (req, res) => {
  const { movieId } = req.params;
  const data = await movieServisces.getMovieById(movieId);

  if (!data) {
    throw createHttpError(404, `Movie with ${movieId} not found`);
    // return res.status(404).json({
    //   message: `Movie with ${movieId} not found`,
    // });
  }

  res.json({
    status: 200,
    message: `Movie with ${movieId} found`,
    data,
  });
};
