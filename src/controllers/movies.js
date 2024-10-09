import * as movieServisces from '../services/movies.js';

import createHttpError from 'http-errors';

import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import { sortFields } from '../db/models/Movie.js';
import parseMovieFilterParams from '../utils/filter/parseMovieFilterParams.js';
import saveFileToUploadDir from '../utils/saveFileTouploadDir.js';
import saveFileTpCloudinary from '../utils/saveFileToCloudinary.js';

import { env } from '../utils/env.js';

export const getMoviesController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams({ ...req.query, sortFields });
  const filter = parseMovieFilterParams(req.query);

  const data = await movieServisces.getAllMovies({
    perPage,
    page,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'All movies found',
    data,
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

export const addMovieController = async (req, res) => {
  let poster;
  if (req.file) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      poster = await saveFileTpCloudinary(req.file, 'posters');
    } else {
      poster = await saveFileToUploadDir(req.file);
    }
  }

  const { _id: userId } = req.user;

  const data = await movieServisces.createMovie({
    ...req.body,
    poster,
    userId,
  });
  res.status(201).json({
    status: 201,
    message: 'movie successfully added',
    data,
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
