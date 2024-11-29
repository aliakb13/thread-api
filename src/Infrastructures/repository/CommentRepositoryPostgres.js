const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const CreatedComment = require("../../Domains/comments/entities/CreatedComment");
const Comment = require("../../Domains/comments/entities/Comment");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(payload) {
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const { content, threadId, userId: owner } = payload;

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
      values: [id, threadId, owner, content, date],
    };

    const result = await this._pool.query(query);

    return new CreatedComment({ ...result.rows[0] });
  }

  async deleteCommentById(commentId) {
    const query = {
      text: "UPDATE comments SET is_deleted = true WHERE id = $1",
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async checkCommentAvail(commentId) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1 AND is_deleted = false",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("comment tidak ditemukan pada database");
    }
  }

  async checkIsCommentOwner(commentId, userId) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1 AND owner = $2",
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError("user bukanlah pemilik dari comment!");
    }
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: "SELECT c.id, c.date, c.content, u.username, c.is_deleted FROM comments c JOIN threads t ON c.thread_id = t.id JOIN users u ON c.owner = u.id WHERE t.id = $1 ORDER BY c.date ASC",
      values: [threadId],
    };

    const result = await this._pool.query(query);

    const comments = result.rows.map((item) => new Comment(item).toJson());
    return comments;
  }
}

module.exports = CommentRepositoryPostgres;
