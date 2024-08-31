import { Schema, model } from 'mongoose';

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      enum: ['fantastic', 'love story'],
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

export const MovieCollection = model('movie', movieSchema);
