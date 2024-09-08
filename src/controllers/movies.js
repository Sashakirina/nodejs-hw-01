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

export const addMovieController = (req, res) => {
  const movie = movieServisces.createMovie(req.body);

  res.status(201).json({
    status: 201,
    message: 'movie successfully added',
    data: movie,
  });
};

export const upsertMovieController = async (req, res) => {
  const { movieId } = req.params;
  const { isNew, data } = await movieServisces.updateMovie(
    { _id: movieId },
    req.body,
    {
      upsert: true,
    },
  );

  const status = isNew ? 201 : 200;

  res.json({
    status,
    message: 'Movie upsert succesfully',
    data,
  });
};

export const patchMovieController = async (req, res) => {
  const { movieId } = req.params;
  const data = await movieServisces.updateMovie({ _id: movieId }, req.body);

  if (!data) {
    throw createHttpError(404, `Movie with id ${movieId} not found`);
  }

  res.json({
    status: 200,
    message: 'Movie successfully patched',
    data,
  });
};

export const deleteMovieController = async (req, res) => {
  const { movieId } = req.params;
  const movie = await movieServisces.deleteMovie({ _id: movieId });

  if (!movie) {
    throw createHttpError(404, `Movie with id ${movieId} not found`);
  }

  res.status(204).send();
};
