// @flow
import createEmailHandler from './email';

export default async (app, context) => {
  const emailHandler = await createEmailHandler(context);
  app.post('/email', emailHandler);
};
