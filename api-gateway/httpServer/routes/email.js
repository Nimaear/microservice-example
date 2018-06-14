// @flow
import config from '../../config';
import createQueue from '../../service/createQueue';

const { rabbitmq } = config;

/*
Example payload:

{
  message:
  {
    data: "eyJlbWFpbEFkZHJlc3MiOiAidXNlckBleGFtcGxlLmNvbSIsICJoaXN0b3J5SWQiOiAiMTIzNDU2Nzg5MCJ9",
    message_id: "1234567890",
  },
  subscription: "projects/myproject/subscriptions/mysubscription"
}


"{"message":{"data":"eyJlbWFpbEFkZHJlc3MiOiAidXNlckBleGFtcGxlLmNvbSIsICJoaXN0b3J5SWQiOiAiMTIzNDU2Nzg5MCJ9","message_id":"1234567890"},"subscription":"projects/myproject/subscriptions/mysubscription"}"
 */

export default async (context) => {
  const { logger } = context;
  const queue = await createQueue(rabbitmq, 'email-sync', logger);

  return async (req, res) => {
    const { message /*, subscription*/ } = req.body;
    const {
      data,
      // message_id,
    } = message;
    const emailData = JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
    logger.info({ emailData });
    queue.place(emailData);
    res.json({
      placed: true,
    });
  };
};
