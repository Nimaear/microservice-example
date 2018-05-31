import { Client } from 'pg';

export default async (context) => {
  const { logger, config } = context;
  try {
    const connectionString = `postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${config.db}`;
    const client = new Client({
      connectionString,
    });
    await client.connect();
    return client;
  } catch (e) {
    logger.error(e);
  }
  return null;
};
