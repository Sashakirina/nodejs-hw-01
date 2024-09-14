import Joi from 'joi';
import { genreList } from '../constants/movies.js';

export const movieAddSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  director: Joi.string().required(),
  genre: Joi.string()
    .valid(...genreList)
    .required(),
  favorites: Joi.boolean(),
});

export const movieUpdateSchema = Joi.object({
  title: Joi.string(),
  year: Joi.number(),
  director: Joi.string(),
  genre: Joi.string().valid(...genreList),
  favorites: Joi.boolean(),
});
