class ReplyRepository {
  constructor() {}

  async addReply(content, commentId, userId) {
    throw new Error("REPLY_REPOSITROY.METHOD_NOT_IMPLEMENTED");
  }

  async deleteReplyById(commentId) {
    throw new Error("REPLY_REPOSITROY.METHOD_NOT_IMPLEMENTED");
  }

  async checkReplyAvail(replyId) {
    throw new Error("REPLY_REPOSITROY.METHOD_NOT_IMPLEMENTED");
  }

  async checkIsReplyOwner(replyId, userId) {
    throw new Error("REPLY_REPOSITROY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = ReplyRepository;
