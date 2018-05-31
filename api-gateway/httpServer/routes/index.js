import math from './math';
import createQueueHandler from './queue';
import createEmailHandler from './email';

export default async (app, context) => {
  const queueHandler = await createQueueHandler(context);
  const emailHandler = await createEmailHandler(context);
  app.post('/queue', queueHandler);
  app.post('/email', emailHandler);
  app.post('/math', math(context));
};
