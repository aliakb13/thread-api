class Reply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.is_deleted
      ? `**balasan telah dihapus**`
      : payload.content;
    this.date = payload.date;
    this.username = payload.username;
  }

  _verifyPayload({ id, content, date, username }) {
    if (!id || !content || !date || !username) {
      throw new Error("REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof date !== "object" ||
      typeof username !== "string"
    ) {
      throw new Error("REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }

  toJson() {
    return {
      id: this.id,
      content: this.content,
      date: this.date,
      username: this.username,
    };
  }
}

module.exports = Reply;
