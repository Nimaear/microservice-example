import { ServiceBroker } from 'moleculer';
import uuid from 'uuid/v4';
import createQueue from './createQueue';
import createLogger from './createLogger';
import config from '../config.json';

const logger = createLogger(config);
const { rabbitmq, serviceName } = config;

// Create broker
// const broker = new ServiceBroker({
//   nodeID: `queue-${uuid()}`,
//   logLevel: 'debug',
//   transporter: {
//     type: 'AMQP',
//     options: {
//       url: `amqp://${rabbitmq.user}:${rabbitmq.password}@${rabbitmq.host}:${rabbitmq.port}`,
//       prefetch: 1,
//     },
//   },
//   logger: (bindings) => logger.child(bindings),
// });

const go = async() => {
  logger.info(`${serviceName} up and running`);

  const queue = await createQueue(rabbitmq, 'tasks', logger);
  queue.consume(async (payload, ack) => {
    logger.info({ payload });
    ack();
  });

  const emailQueue = await createQueue(rabbitmq, 'email-sync', logger);
  emailQueue.consume(async (payload, ack) => {
    logger.info({ Email: payload });
    ack();
  });
};

go();
