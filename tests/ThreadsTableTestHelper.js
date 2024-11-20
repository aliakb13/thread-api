/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadTableTestHelper = {
  async addThread({
    id = "thread-123",
    userId = "user-123",
    title = "some title",
    body = "some body",
  }) {
    const date = new Date().toISOString();
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5)",
      values: [id, userId, title, body, date],
    };

    await pool.query(query);
  },
  async findThreadById(threadId) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = await pool.query(query);
    return result.rows;
  },
  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
    // await pool.query("DELETE FROM users WHERE 1=1");
  },
};

module.exports = ThreadTableTestHelper;
