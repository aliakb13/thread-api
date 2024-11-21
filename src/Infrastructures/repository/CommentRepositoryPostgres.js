const CommentRepository = require("../../Domains/comments/CommentRepository");
const CreatedComment = require("../../Domains/comments/entities/CreatedComment");

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
}

module.exports = CommentRepositoryPostgres;
