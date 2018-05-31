import config from '../../config';
import createQueue from '../../service/createQueue';

const { rabbitmq } = config;

export default async (context) => {
  const { logger } = context;
  let count = 0;
  const queue = await createQueue(rabbitmq, 'emails', logger);

  return async (req, res) => {
    const payload = req.body;
    logger.info({ payload });
    queue.place({
      ...payload,
      count: count++,
    });
    res.json({
      placed: true,
    });
  };
};