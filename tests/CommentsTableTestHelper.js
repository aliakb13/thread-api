/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool");
const CreatedComment = require("../src/Domains/comments/entities/CreatedComment");

const CommentsTableTestHelper = {
  async addComment({
    id = "comment-123",
    threadId = "thread-123",
    owner = "user-678",
    content = "some content",
  }) {
    const date = new Date().toISOString();
    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
      values: [id, threadId, owner, content, date],
    };

    await pool.query(query);
  },
  async findCommentById(commentId) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },
  async cleanTable() {
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

module.exports = CommentsTableTestHelper;
