import math from './math';
import queue from './queue';

export default async (app, context) => {
  const queueHandler = await queue(context);
  app.post('/queue', queueHandler);
  app.post('/math', math(context));
}
