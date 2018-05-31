import { ServiceBroker } from 'moleculer';
import uuid from 'uuid/v4';
import connectToPg from './connectToPg';
import createQueue from './createQueue';
import createLogger from './createLogger';
import config from '../config.json';

const logger = createLogger(config);
const { rabbitmq, postgres, serviceName } = config;

// Create broker
const broker = new ServiceBroker({
  nodeID: `queue-${uuid()}`,
  transporter: {
    type: 'AMQP',
    options: {
      url: `amqp://${rabbitmq.user}:${rabbitmq.password}@${rabbitmq.host}:${rabbitmq.port}`,
      prefetch: 1,
    },
  },
  logger: (bindings) => logger.child(bindings),
});

broker.start().then(async () => {
  setTimeout(async () => {
    logger.info(`${serviceName} up and running`);
    const pgClient = await connectToPg({ config: postgres, logger });
    const queue = await createQueue(rabbitmq, 'emails', logger);

    queue.consume(async (payload, ack) => {
      const insertQuery = 'INSERT INTO emails(data) VALUES($1) RETURNING *';
      try {
        const res = await pgClient.query(insertQuery, [payload]);
        logger.info(res);
      } catch (e) {
        logger.error(e);
      }
      ack();
    });
  }, 10000);
});
