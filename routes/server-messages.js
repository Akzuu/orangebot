const schema = {
  description: 'Life check',
  summary: 'Life check',
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
    },
    required: ['id'],
  },
  query: {
    type: 'object',
    properties: {
      rconPassword: {
        type: 'string',
      },
      rconPort: {
        type: 'number',
      },
      rconAddr: {
        type: 'string',
      },
    },
  },
  response: {

  },
};

const handler = (req, reply) => {
  reply.send({
    status: 'OK',
    date: new Date(),
  });
};

module.exports = {
  method: 'GET',
  url: '/:id/log',
  handler,
  schema,
};
