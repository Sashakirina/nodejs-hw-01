import { Schema, model } from 'mongoose';

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    favorites: {
      type: Boolean,
      required: true,
      default: false,
    },
    poster: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

export const sortFields = [
  'title',
  'year',
  'director',
  'genre',
  'favorites',
  '_id',
];

export const MovieCollection = model('movie', movieSchema);
