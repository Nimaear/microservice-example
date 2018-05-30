import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

export default async (broker, logger) => {
  const app = express();
  app.use(bodyParser.json());
  await routes(app, { broker, logger });
  app.get('/', (req, res) => {
    res.json({ OK: true });
  });
  return app;
};
