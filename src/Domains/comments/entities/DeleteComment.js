class DeleteComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.threadId = payload.threadId;
    this.userId = payload.userId;
    this.commentId = payload.commentId;
  }

  _verifyPayload({ threadId, userId, commentId }) {
    if (!threadId || !userId || !commentId) {
      throw new Error("DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof threadId !== "string" ||
      typeof userId !== "string" ||
      typeof commentId !== "string"
    ) {
      throw new Error("DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = DeleteComment;
