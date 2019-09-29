const { msgHandler } = require('../orangebot');

const schema = {
  description: '',
  summary: '',
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
      message: {
        type: 'string',
      },
    },
  },
  response: {

  },
};

const handler = async (req, reply) => {
  const info = {
    address: req.query.rconAddr,
    port: req.query.rconPort,
    rconPass: req.query.rconPass,
    container: req.params.id,
  };
  const msg = req.query.message;

  try {
    await msgHandler(msg, info);
  } catch (error) {
    console.log(error);
    reply.status(500).send(error);
    return;
  }

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
