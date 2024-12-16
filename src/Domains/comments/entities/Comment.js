class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.date;
    this.content = payload.is_deleted
      ? '**komentar telah dihapus**'
      : payload.content;
    this.replies = payload.replies;
  }

  _verifyPayload({
    id, username, date, content, replies,
  }) {
    if (!id || !username || !date || !content || !replies) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || typeof date !== 'object'
      || typeof content !== 'string'
      || typeof replies !== 'object'
    ) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  toJson() {
    return {
      id: this.id,
      username: this.username,
      date: this.date,
      content: this.content,
      replies: this.replies,
    };
  }
}

module.exports = Comment;
