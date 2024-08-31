import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { env } from './utils/env.js';
import { MovieCollection } from './db/models/Movie.js';

console.log(process.env.PORT);

export const startServer = () => {
  const app = express();

  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  app.use(logger);
  app.use(cors());
  app.use(express.json());

  app.get('/movies', async (req, res) => {
    const movies = await MovieCollection.find();
    res.status(200).json({
      data: movies,
    });
  });

  app.get('movies/:movieId', async (req, res) => {
    const { movieId } = req.params;
    const data = await MovieCollection.findById(movieId);

    if (!data) {
      return res.status(404).json({
        message: `Movie with ${movieId} not found`,
      });
    }
    res.json({});
  });

  app.use((req, res) => {
    res.status(404).json({
      message: `${req.url} not found`,
    });
  });

  app.use((error, req, res, next) => {
    res.status(500).json({
      message: error.message,
    });
  });

  const port = Number(env('PORT', '3000'));

  app.listen(port, () => console.log('Server is running'));
};
