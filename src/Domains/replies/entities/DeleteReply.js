class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.threadId = payload.threadId;
    this.commentId = payload.commentId;
    this.replyId = payload.replyId;
    this.userId = payload.userId;
  }

  _verifyPayload({ threadId, commentId, replyId, userId }) {
    if (!threadId || !commentId || !replyId || !userId) {
      throw new Error("DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof threadId !== "string" ||
      typeof commentId !== "string" ||
      typeof replyId !== "string" ||
      typeof userId !== "string"
    ) {
      throw new Error("DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = DeleteReply;
