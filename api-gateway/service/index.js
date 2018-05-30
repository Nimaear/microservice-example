import { ServiceBroker } from 'moleculer';
import uuid from 'uuid/v4';
import createLogger from './createLogger';
import createHttpServer from '../httpServer';
import config from '../config';

const logger = createLogger(config);
const { rabbitmq, port, serviceName } = config;

// Create broker
const broker = new ServiceBroker({
  nodeID: `api-gateway-${uuid()}`,
  transporter: {
    type: 'AMQP',
    options: {
      url: `amqp://${rabbitmq.user}:${rabbitmq.password}@${rabbitmq.host}:${rabbitmq.port}`,
      eventTimeToLive: 5000,
      prefetch: 1,
    },
  },
  logger: (bindings) => logger.child(bindings),
});

broker
  .start()
  .then(() => broker.waitForServices('Math'))
  .then(async () => {
    const app = await createHttpServer(broker, logger);
    app.listen(port, () => logger.info(`${serviceName} listening on port: ${port}`));
  });
