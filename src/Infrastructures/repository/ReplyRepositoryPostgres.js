const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ReplyRepository = require("../../Domains/replies/ReplyRepository");
const CreatedReply = require("../../Domains/replies/entities/CreatedReply");
const Reply = require("../../Domains/replies/entities/Reply");

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(payload) {
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const { commentId, userId: owner, content } = payload;

    const query = {
      text: "INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
      values: [id, commentId, owner, content, date],
    };

    const result = await this._pool.query(query);
    return new CreatedReply({ ...result.rows[0] });
  }

  async deleteReplyById(replyId) {
    const query = {
      text: "UPDATE replies SET is_deleted = true WHERE id = $1",
      values: [replyId],
    };

    await this._pool.query(query);
  }

  async checkReplyAvail(replyId) {
    const query = {
      text: "SELECT * FROM replies WHERE id = $1 AND is_deleted = false",
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(
        "Reply yang anda cari tidak ditemukan pada database!"
      );
    }
  }

  async checkIsReplyOwner(replyId, userId) {
    const query = {
      text: "SELECT * FROM replies WHERE id = $1 AND owner = $2",
      values: [replyId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError("User bukanlah pemilik dari reply!");
    }
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: "SELECT r.id, r.content, r.date, r.is_deleted, u.username FROM replies r INNER JOIN users u ON r.owner = u.id WHERE r.comment_id = $1 ORDER BY r.date ASC",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    const replies = result.rows.map((row) => new Reply(row).toJson());

    return replies;
  }
}

module.exports = ReplyRepositoryPostgres;
