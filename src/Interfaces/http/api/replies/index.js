const ReplyHander = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'reply',
  version: '1.0.0',
  register: async (server, { container }) => {
    const replyHandler = new ReplyHander(container);
    server.route(routes(replyHandler));
  },
};
