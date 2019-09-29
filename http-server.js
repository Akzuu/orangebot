const fastify = require('fastify');
const fastifySwagger = require('fastify-swagger');
const routes = require('./routes');

// Initialize swagger
const initSwagger = (port) => ({
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'AKL Bot',
      description: 'Bot for AKL servers',
      version: '1.0.0',
    },
    host: `0.0.0.0:${port}`,
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  exposeRoute: true,
});

const serverRoutes = async (server) => {
  Object.keys(routes).forEach((key) => {
    server.route(routes[key]);
  });
};

/**
 * Init server
 * @param {Object} options Optional.
 */
const initServer = async (options, port) => {
  const server = fastify(options);

  server
    .register(fastifySwagger, initSwagger(port))
    .register(serverRoutes, { prefix: '/server' });


  return {
    start: async () => {
      await server.listen(port, '0.0.0.0');
      return server;
    },
  };
};

module.exports = {
  initServer,
};
