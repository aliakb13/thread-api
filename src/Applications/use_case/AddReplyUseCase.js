const CreateReply = require('../../Domains/replies/entities/CreateReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(payload) {
    const createReply = new CreateReply(payload);
    await this._threadRepository.checkThreadAvail(createReply.threadId);
    await this._commentRepository.checkCommentAvail(createReply.commentId);
    return this._replyRepository.addReply(createReply);
  }
}

module.exports = AddReplyUseCase;
