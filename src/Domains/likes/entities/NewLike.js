class NewLike {
  constructor(payload) {
    this._verifyPayload(payload);

    this.userId = payload.userId;
    this.threadId = payload.threadId;
    this.commentId = payload.commentId;
  }

  _verifyPayload({ userId, threadId, commentId }) {
    if (!userId || !threadId || !commentId) {
      throw new Error('NEW_LIKE.NOT_CONTAIN.NEEDED_PROPERTY');
    }

    if (typeof userId !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string') {
      throw new Error('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewLike;
