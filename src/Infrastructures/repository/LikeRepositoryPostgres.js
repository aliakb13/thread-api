const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async checkIsLikeExist(userId, commentId) {
    const query = {
      text: 'SELECT * FROM likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    const result = await this._pool.query(query);

    return result.rowCount;
  }

  async addLike(userId, commentId) {
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, userId, commentId],
    };

    await this._pool.query(query);
  }

  async deleteLike(userId, commentId) {
    const query = {
      text: 'DELETE FROM likes WHERE user_id = $1 AND comment_id = $2',
      values: [userId, commentId],
    };

    await this._pool.query(query);
  }

  async countLike(commentId) {
    const query = {
      text: 'SELECT COUNT(user_id) FROM likes WHERE thread_id = $1 AND comment_id = $2',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }
}

module.exports = LikeRepositoryPostgres;
