const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const pool = require('../../database/postgres/pool');

describe('LikeRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
  });

  describe('checkIsLikeExist function', () => {
    it('should return 0 if searched like not exist or not found', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const foundNum = await likeRepositoryPostgres.checkIsLikeExist('', '');

      // Assert
      expect(foundNum).toEqual(0);
    });

    it('should return 1 if searched like is found or exist', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({});
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const foundNum = await likeRepositoryPostgres.checkIsLikeExist('user-123', 'comment-123');

      // Assert
      expect(foundNum).toEqual(1);
    });
  });

  describe('addLike function', () => {
    it('should persist added comment and return added comment correctly', async () => {
      // Arrange
      const userLike = {
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      };

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike(userLike);

      // Assert
      const like = await LikesTableTestHelper.findLikeById('like-123');
      expect(like).toHaveLength(1);
    });
  });

  describe('deleteLike function', () => {
    it('should delete like properly', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({});
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      await likeRepositoryPostgres.deleteLike('user-123', 'comment-123');

      // Assert
      const like = await LikesTableTestHelper.findLikeById('like-123');
      expect(like).toHaveLength(0);
    });
  });

  describe('countLike function', () => {
    it('should return a correct number for count comment like', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({ id: 'like-123', userId: 'user-123' });
      await LikesTableTestHelper.addLike({ id: 'like-345', userId: 'user-345' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const { count } = await likeRepositoryPostgres.countLike('comment-123');

      // Assert
      expect(count).toEqual('2'); // sementara pake string, kalo butuh int jangan lupa diganti
    });
  });
});
