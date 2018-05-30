import bunyan from 'bunyan';

export default config => {
  if (config.environment === 'development') {
    return bunyan.createLogger({
      name: config.serviceName,
      level: bunyan.DEBUG,
      serializers: {
        req: bunyan.stdSerializers.req,
        res: bunyan.stdSerializers.res,
      },
    });
  }
  return bunyan.createLogger({
    name: config.serviceName,
    level: bunyan.INFO,
    serializers: {
      req: bunyan.stdSerializers.req,
      res: bunyan.stdSerializers.res,
    },
  });
};
