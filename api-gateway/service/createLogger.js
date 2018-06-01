// @flow
import pino from 'pino';
import childProcess from 'child_process';
import path from 'path';
import stream from 'stream';
import tee from 'pino-tee';
import fs from 'fs';
import config from '../config';


const cwd = process.cwd();
const { env } = process;
const logPath = path.resolve(cwd, 'logs');

const logThrough = new stream.PassThrough();

export default (config) => {
  const isDev = config.environment === 'development' ;

  const logger = pino({
    name: config.serviceName,
    // level: isDev ? 'debug' : 'info',
  }, logThrough)

  const child = childProcess.spawn(process.execPath, [
    require.resolve('pino-tee'),
    'debug', `${logPath}/debug.log`,
    'info', `${logPath}/info.log`,
    'warn', `${logPath}/warn.log`,
    'error', `${logPath}/error.log`,
    'fatal', `${logPath}/fatal.log`
  ], {cwd, env});

  if (isDev) {
    // const pretty = pino.pretty();
    // pretty.pipe(process.stdout);
    // logThrough.pipe(pretty);
  }

  return logger;
};
