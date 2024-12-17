const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const PasswordHash = require('../../../Applications/security/PasswordHash');

describe('/likes endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  describe('when PUT /likes', () => {
    it('should add to database if user not giving like', async () => {
      // Arrange
      const password = await container
        .getInstance(PasswordHash.name)
        .hash('secret');
      await UsersTableTestHelper.addUser({ password });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ owner: 'user-123' });
      const server = await createServer(container);

      // login user
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(authResponse.payload);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      // console.log(response);
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');

      const foundLike = await LikesTableTestHelper.checkLike('user-123', 'comment-123');
      expect(foundLike).toEqual(1);
    });

    it('should delete like if user is giving like first', async () => {
      // Arrange
      const password = await container
        .getInstance(PasswordHash.name)
        .hash('secret');
      await UsersTableTestHelper.addUser({ password });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ owner: 'user-123' });
      await LikesTableTestHelper.addLike({});
      const server = await createServer(container);

      // login user
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(authResponse.payload);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      // console.log(response);
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');

      const foundLike = await LikesTableTestHelper.checkLike('user-123', 'comment-123');
      expect(foundLike).toEqual(0);
    });
  });
});
