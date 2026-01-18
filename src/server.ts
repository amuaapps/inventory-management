import express from 'express';
import payload from 'payload';
import { config } from './config';

const app = express();

const start = async () => {
  await payload.init({
    secret: config.payloadSecret,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  app.listen(config.port, () => {
    payload.logger.info(`Server listening on port ${config.port}`);
  });
};

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
