const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ userRepository, threadRepository, commentRepository }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(userPayload) {
    const deleteComment = new DeleteComment(userPayload);
    await this._userRepository.checkUserAvail(deleteComment.userId);
    await this._threadRepository.checkThreadAvail(deleteComment.threadId);
    await this._commentRepository.checkCommentAvail(deleteComment.commentId);
    await this._commentRepository.checkIsCommentOwner(
      deleteComment.commentId,
      deleteComment.userId,
    );
    await this._commentRepository.deleteCommentById(deleteComment.commentId);
  }
}

module.exports = DeleteCommentUseCase;
