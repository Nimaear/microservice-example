import { ServiceBroker } from 'moleculer';
import uuid from 'uuid/v4';
import createQueue from './createQueue';
import createLogger from './createLogger';
import config from '../config.json';

const logger = createLogger(config);
const { rabbitmq, serviceName } = config;

// Create broker
const broker = new ServiceBroker({
  nodeID: `queue-${uuid()}`,
  transporter: {
    type: 'AMQP',
    options: {
      url: `amqp://${rabbitmq.user}:${rabbitmq.pass}@${rabbitmq.host}:${rabbitmq.port}`,
      prefetch: 1,
    },
  },
  logger: (bindings) => logger.child(bindings),
});

broker.start().then(async () => {
  logger.info(`${serviceName} up and running`);

  const queue = await createQueue(rabbitmq, 'tasks', logger);
  queue.consume(async (payload, ack) => {
    setTimeout(() => {
      logger.info({ payload });
      ack();
    }, 5000);
  });
});
