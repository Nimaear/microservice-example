// @flow
import pino from 'pino';
import path from 'path';
import config from '../config';
import childProcess from 'child_process';
import { PassThrough } from 'stream';

const logPath = `${process.cwd()}/logs`;
const logThrough = new PassThrough();


export default (config) => {

  const logger = pino({
    name: config.serviceName,
    level: 'debug',
  }, logThrough);
  let processes;
  if (config.environment === 'production') {
    processes = [
      require.resolve('pino-tee'),
      'warn', `${logPath}/warn.log`,
      'error', `${logPath}/error.log`,
      'fatal', `${logPath}/fatal.log`
    ];
  } else {
    processes = [
      require.resolve('pino-tee'),
      'debug', `${logPath}/debug.log`,
      'info', `${logPath}/info.log`,
      'warn', `${logPath}/warn.log`,
      'error', `${logPath}/error.log`,
      'fatal', `${logPath}/fatal.log`
    ];
  }
  const child = childProcess.spawn(process.execPath, processes, {
    cwd: __dirname,
    env: process.env
  });

  logThrough.pipe(child.stdin);
  if (config.environment === 'development') {
    const pretty = pino.pretty();

    pretty.pipe(process.stdout);
    logThrough.pipe(pretty);
  }

  return logger;
};
