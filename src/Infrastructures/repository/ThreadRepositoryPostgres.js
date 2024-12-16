const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const CreatedThread = require('../../Domains/threads/entities/CreatedThread');
const Thread = require('../../Domains/threads/entities/Thread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

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
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, userId, title, body, date],
    };

    const result = await this._pool.query(query);
    return new CreatedThread({ ...result.rows[0] });
  }

  async getThreadById(threadId) {
    // old query
    /* SELECT threads.id, threads.title, threads.body, threads.date, users.username
    FROM threads INNER JOIN users ON threads.owner = users.id
    WHERE threads.id = $1 AND threads.owner = $2 */

    const query = {
      text: 'SELECT t.id, t.title, t.body, t.date, u.username FROM threads t INNER JOIN users u ON t.owner = u.id WHERE t.id = $1 ORDER BY t.date ASC',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return new Thread({ ...result.rows[0], comments: [] });
  }

  async checkThreadAvail(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan pada database');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
