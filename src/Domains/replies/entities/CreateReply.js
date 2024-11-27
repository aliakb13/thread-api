class CreateReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
    this.commentId = payload.commentId;
    this.userId = payload.userId;
    this.threadId = payload.threadId;
  }

  _verifyPayload({ content, commentId, userId, threadId }) {
    if (!content || !commentId || !userId || !threadId) {
      throw new Error("CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof content !== "string" ||
      typeof commentId !== "string" ||
      typeof userId !== "string" ||
      typeof threadId !== "string"
    ) {
      throw new Error("CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = CreateReply;
