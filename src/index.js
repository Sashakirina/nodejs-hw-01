import { startServer } from './server.js';
import { initMongoDB } from './db/initMongodDB.js';

const bootstrap = async () => {
  await initMongoDB();
  startServer();
};

bootstrap();
