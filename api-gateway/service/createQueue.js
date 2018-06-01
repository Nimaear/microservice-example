// @flow
import amqplib from 'amqplib';

let rabbit;
let channel;

export default async (config, queueName, logger) => {
  if (!rabbit) {
    const rabbitMQUrl = `amqp://${config.user}:${config.password}@${config.host}:${config.port}`;
    rabbit = await amqplib.connect(rabbitMQUrl);
    channel = await rabbit.createChannel();
  }

  try {
    await channel.assertQueue(queueName, { durable: true });
    channel.prefetch(1);
    return {
      consume: (consumer) => {
        channel.consume(queueName, (msg) => {
          if (msg !== null) {
            const payload = JSON.parse(msg.content.toString('utf-8'));
            consumer(payload);
            channel.ack(msg);
          }
        });
      },
      place: (payload) => {
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)));
      },
    };
  } catch (e) {
    logger.error(e);
  }
};
