import { ServiceBroker } from 'moleculer';
import uuid from 'uuid/v4';
import createLogger from './createLogger';
import config from '../config.json';

const logger = createLogger(config);
const {
  rabbitmq,
  serviceName,
} = config;


// Create broker
const broker = new ServiceBroker({
  nodeID: `math-${uuid()}`,
  transporter: {
    type: 'AMQP',
    options: {
      url: `amqp://${ rabbitmq.user }:${ rabbitmq.pass }@${ rabbitmq.host }:${ rabbitmq.port }`,
      prefetch: 1,
    },
  },
  logger: bindings => logger.child(bindings),
});

broker.createService({
  name: serviceName,
  actions: {
    add(ctx) {
      // Simulate a call that's taking 1000 milliseconds
      logger.info('Got', ctx.params);
      return new Promise((resolve) => {
        setTimeout(() => {
          const { a, b } = ctx.params;
          logger.info('Sent', Number(a) + Number(b));
          resolve(Number(a) + Number(b));
        }, 1000);
      });
    },
  },
});

broker.start()
  .then(async () => {
    logger.info(`${ serviceName } up and running`);
  });
