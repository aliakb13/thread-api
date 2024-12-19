const GiveLikeCommentUseCase = require('../../../../Applications/use_case/GiveLikeCommentUseCase');

class LikesCommentHandler {
  constructor(container) {
    this._container = container;

    this.putToggleLikeComment = this.putToggleLikeComment.bind(this);
  }

  async putToggleLikeComment(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const fullPayload = {
      userId,
      threadId,
      commentId,
    };

    const giveLikeCommentUseCase = this._container.getInstance(GiveLikeCommentUseCase.name);
    await giveLikeCommentUseCase.execute(fullPayload);
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesCommentHandler;
