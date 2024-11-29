const CreateComment = require("../../Domains/comments/entities/CreateComment");

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    const createComment = new CreateComment(payload);
    await this._threadRepository.checkThreadAvail(createComment.threadId);
    return this._commentRepository.addComment(createComment);
  }
}

module.exports = AddCommentUseCase;
