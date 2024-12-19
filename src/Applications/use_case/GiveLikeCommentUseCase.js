class GiveLikeCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    const { userId, threadId, commentId } = payload;
    await this._threadRepository.checkThreadAvail(threadId);
    await this._commentRepository.checkCommentAvail(commentId);
    const numFound = await this._commentRepository.checkIsLikeExist(userId, commentId);

    if (numFound === 0) {
      await this._commentRepository.addLike(userId, commentId);
    } else {
      await this._commentRepository.deleteLike(userId, commentId);
    }
  }
}

module.exports = GiveLikeCommentUseCase;
