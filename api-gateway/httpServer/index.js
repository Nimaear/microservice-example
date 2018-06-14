// @flow
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import path from 'path';
import routes from './routes';
import expressPinoLogger from 'express-pino-logger';

import config from '../config';

const options = {
  key: fs.readFileSync(path.resolve('keys/server.key')),
  cert: fs.readFileSync(path.resolve('keys/server.crt')),
  requestCert: false,
  rejectUnauthorized: false,
};

const { origins } = config;

export default async (broker, logger) => {

  const app = express();
  app.use(bodyParser.json());

  app.use(expressPinoLogger({ logger }))

  // secure apps by setting various HTTP headers
  app.use(helmet());

  // enable CORS - Cross Origin Resource Sharing
  app.use(cors());

  // Take care of allowed origins
  app.use((req, res, next) => {
    if (origins.length > 0) {
      const { origin } = req.headers;
      if (origins.indexOf(origin) > -1) {
        res.header('Access-Control-Allow-Origin', origin);
      }
    }
    next();
  });
  // Add routes
  await routes(app, { broker, logger });

  app.use((error, req, res, next) => {
    logger.error({ error });
    next(error);
  })

  // Simple health-check
  app.get('/', (req, res) => {
    const { query } = req;
    res.json({ Iam: 'OK' });
  });


  return https.createServer(options, app);
};
