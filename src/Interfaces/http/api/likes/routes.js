const routes = (handler) => [
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.putToggleLikeComment,
    options: {
      auth: 'forumapiauth_jwt',
    },
  },
];

module.exports = routes;
