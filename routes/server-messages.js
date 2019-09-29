const { msgHandler } = require('../msg-handler');

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
    },
    required: ['rconPassword', 'rconPort', 'rconAddr'],
  },
  body: {
    type: 'string',
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
  console.log('Info: ', info);
  console.log('Body: ', req.body);
  const messages = req.body.split('\n');

  console.log('Oletettu array: ', messages);

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    reply.code(400).send({
      status: 'No Body',
    });
  }
  try {
    messages.forEach((msg) => {
      msgHandler(msg, info);
    });
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
  method: 'POST',
  url: '/id/:id/log',
  handler,
  schema,
};
