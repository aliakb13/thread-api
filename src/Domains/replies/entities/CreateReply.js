class CreateReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
    this.commentId = payload.commentId;
    this.userId = payload.userId;
  }

  _verifyPayload({ content, commentId, userId }) {
    if (!content || !commentId || !userId) {
      throw new Error("CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof content !== "string" ||
      typeof commentId !== "string" ||
      typeof userId !== "string"
    ) {
      throw new Error("CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = CreateReply;
