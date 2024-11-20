const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const CreatedThread = require("../../Domains/threads/entities/CreatedThread");
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

  async getThreadById(threadId, userId) {
    const query = {
      text: "SELECT threads.id, threads.title, threads.body, threads.date, users.username FROM threads INNER JOIN users ON threads.owner = users.id WHERE threads.id = $1 AND threads.owner = $2",
      values: [threadId, userId],
    };

    const result = await this._pool.query(query);
    // console.log(result);

    if (!result.rowCount) {
      throw new NotFoundError("thread yang dicari tidak ditemukan!");
    }
    return result.rows[0];
  }

  // async checkThreadAvail(threadId) {}
}

module.exports = ThreadRepositoryPostgres;
