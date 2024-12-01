const DeleteReply = require("../../Domains/replies/entities/DeleteReply");

class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(payload) {
    const deleteReply = new DeleteReply(payload);
    await this._threadRepository.checkThreadAvail(deleteReply.threadId);
    await this._commentRepository.checkCommentAvail(deleteReply.commentId);
    await this._replyRepository.checkReplyAvail(deleteReply.replyId);
    await this._replyRepository.checkIsReplyOwner(
      deleteReply.replyId,
      deleteReply.userId
    );
    await this._replyRepository.deleteReplyById(deleteReply.replyId);
  }
}

module.exports = DeleteReplyUseCase;
