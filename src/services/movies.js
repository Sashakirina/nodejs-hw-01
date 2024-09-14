import { SORT_ORDER } from '../constants/index.js';
import { MovieCollection } from '../db/models/Movie.js';
import calculatePaginationData from '../utils/calculatePaginationData.js';

export const getAllMovies = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = SORT_ORDER[0],
  filter = {},
}) => {
  const skip = (page - 1) * perPage;
  const movieQuery = MovieCollection.find();

  if (filter.minYear) {
    movieQuery.where('year').gte(filter.minYear);
  }

  if (filter.maxYear) {
    movieQuery.where('year').lte(filter.maxYear);
  }

  const movies = await movieQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const count = await MovieCollection.find().merge(movieQuery).countDocuments();

  const paginationData = calculatePaginationData({ count, perPage, page });

  return {
    page,
    perPage,
    movies,
    totalItems: count,
    ...paginationData,
  };
};

export const getMovieById = (movieId) => MovieCollection.findById(movieId);

export const createMovie = async (payload) => {
  const movie = await MovieCollection.create(payload);
  return movie;
};

export const updateMovie = async (filter, data, options = {}) => {
  const rawResult = await MovieCollection.findOneAndUpdate(filter, data, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteMovie = async (filter) =>
  await MovieCollection.findOneAndDelete(filter);
