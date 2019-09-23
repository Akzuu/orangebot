const config = require('config');
const fastify = require('fastify');
const fastifySwagger = require('fastify-swagger');
const routes = require('./routes');

// Initialize swagger
const initSwagger = () => {
  const swaggerOptions = config.get('swagger');

  return {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Project AKL 2020 Web Backend - Core',
        description: 'Project AKL 2020 Web Backend - Core',
        version: '1.0.0',
      },
      host: swaggerOptions.host,
      schemes: swaggerOptions.schemes,
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        {
          name: 'Integration',
          description: 'Integration endpoints for accessing and controlling data',
        },
        {
          name: 'Utility',
          description: 'Utility endpoints',
        },
      ],
    },
    exposeRoute: true,
  };
};

const serverRoutes = async (server) => {
  Object.keys(routes).forEach((key) => {
    server.route(routes[key]);
  });
};

/**
 * Init server
 * @param {Object} options Optional.
 */
const initServer = async (options) => {
  const server = fastify(options);

  server
    .register(fastifySwagger, initSwagger())
    .register(serverRoutes, { prefix: '/server' });


  return {
    start: async () => {
      await server.listen(APPLICATION_PORT, '0.0.0.0');
      return server;
    },
  };
};

module.exports = {
  initServer,
};
