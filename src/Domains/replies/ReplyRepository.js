/* eslint-disable no-unused-vars */

class ReplyRepository {
  // payload = content, commentId, userId
  async addReply(createRepository) {
    throw new Error('REPLY_REPOSITROY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReplyById(replyId) {
    throw new Error('REPLY_REPOSITROY.METHOD_NOT_IMPLEMENTED');
  }

  async checkReplyAvail(replyId) {
    throw new Error('REPLY_REPOSITROY.METHOD_NOT_IMPLEMENTED');
  }

  async checkIsReplyOwner(replyId, userId) {
    throw new Error('REPLY_REPOSITROY.METHOD_NOT_IMPLEMENTED');
  }

  async getRepliesByCommentId(commentId) {
    throw new Error('REPLY_REPOSITROY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ReplyRepository;
