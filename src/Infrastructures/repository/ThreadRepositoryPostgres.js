const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const CreatedThread = require("../../Domains/threads/entities/CreatedThread");
const Thread = require("../../Domains/threads/entities/Thread");
const Comment = require("../../Domains/comments/entities/Comment");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(payload) {
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const { title, body, userId } = payload;

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner",
      values: [id, userId, title, body, date],
    };

    const result = await this._pool.query(query);
    // console.log(result);
    return new CreatedThread({ ...result.rows[0] });
  }

  async getThreadById(threadId) {
    // old query
    /* SELECT threads.id, threads.title, threads.body, threads.date, users.username FROM threads INNER JOIN users ON threads.owner = users.id WHERE threads.id = $1 AND threads.owner = $2 */

    const query = {
      text: `SELECT t.id AS thread_id, t.title, t.body, t.date AS thread_date, u.username AS thread_username, c.id AS comment_id, uc.username AS comment_username, c.date AS comment_date, CASE 
        WHEN c.is_deleted THEN '**komentar telah dihapus**'
        ELSE c.content
    END AS comment_content FROM threads t INNER JOIN users u ON t.owner = u.id LEFT JOIN comments c ON t.id = c.thread_id LEFT JOIN users uc ON c.owner = uc.id WHERE t.id = $1 ORDER BY t.date ASC, c.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    // console.log(result);

    if (!result.rowCount) {
      throw new NotFoundError("thread yang dicari tidak ditemukan!");
    }

    const comments = [];

    result.rows.forEach((row) => {
      if (row.comment_id) {
        comments.push(
          new Comment({
            id: row.comment_id,
            username: row.comment_username,
            content: row.comment_content,
            date: row.comment_date,
          })
        );
      }
    });

    const thread = new Thread({
      id: result.rows[0].thread_id,
      title: result.rows[0].title,
      body: result.rows[0].body,
      date: result.rows[0].thread_date,
      username: result.rows[0].thread_username,
      comments,
    });

    return thread;
  }

  // async checkThreadAvail(threadId) {}
}

module.exports = ThreadRepositoryPostgres;
