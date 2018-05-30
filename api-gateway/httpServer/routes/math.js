export default (context) => {
  const { broker, logger } = context;
  let count = 0;
  return async (req, res) => {
    const { a, b } = req.body;
    const total = await broker.call('Math.add', { a, b, count: ++count });
    logger.info({ received: total, sent: { a, b, count } });
    res.json({
      input: { a, b },
      total,
    });
  };
};
