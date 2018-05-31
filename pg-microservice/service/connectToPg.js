import { Client } from 'pg';

export default async (context) => {
  const { logger, config } = context;
  try {
    const client = new Client(config);
    await client.connect();
    return client;
  } catch (e) {
    logger.error(e);
  }
  return null;
};
