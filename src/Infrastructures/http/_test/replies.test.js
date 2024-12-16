const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');
const PasswordHash = require('../../../Applications/security/PasswordHash');

describe('/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe('POST /REPLIES', () => {
    it('should response 201 and persisted the reply', async () => {
      // Arrange
      const password = await container
        .getInstance(PasswordHash.name)
        .hash('secret');
      await UsersTableTestHelper.addUser({ password });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
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
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: {
          content: 'some content that user post through endpoint',
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it('should response 404 if the thread not found', async () => {
      // Arrange
      const password = await container
        .getInstance(PasswordHash.name)
        .hash('secret');
      await UsersTableTestHelper.addUser({ password });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
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
        method: 'POST',
        url: '/threads/thread-not-found/comments/comment-123/replies',
        payload: {
          content: 'some content that user post through endpoint',
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'thread tidak ditemukan pada database',
      );
    });

    it('should response 404 if the comment not found', async () => {
      // Arrange
      const password = await container
        .getInstance(PasswordHash.name)
        .hash('secret');
      await UsersTableTestHelper.addUser({ password });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
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
        method: 'POST',
        url: '/threads/thread-123/comments/comment-not-found/replies',
        payload: {
          content: 'some content that user post through endpoint',
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'comment tidak ditemukan pada database',
      );
    });

    it('should response 400 if the payload is not valid', async () => {
      // Arrange
      const password = await container
        .getInstance(PasswordHash.name)
        .hash('secret');
      await UsersTableTestHelper.addUser({ password });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
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
        method: 'POST',
        url: '/threads/thread-123/comments/comment-not-found/replies',
        payload: {
          notValid: 'some content that user post through endpoint',
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'content harus dikirimkan ketika membuat reply baru',
      );
    });
  });

  describe('DELETE /REPLIES', () => {
    it('should response 200 if all the payload valid and failed if try to delete it again', async () => {
      const password = await container
        .getInstance(PasswordHash.name)
        .hash('secret');
      await UsersTableTestHelper.addUser({ password });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ owner: 'user-123' });
      await RepliesTableTestHelper.addReply({});
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
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // try to delete it again
      const notFoundres = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      const responseNotFound = JSON.parse(notFoundres.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(notFoundres.statusCode).toEqual(404);
      expect(responseNotFound.status).toEqual('fail');
      expect(responseNotFound.message).toEqual(
        'Reply yang anda cari tidak ditemukan pada database!',
      );
    });

    it('should response 404 if the thread is not found', async () => {
      const password = await container
        .getInstance(PasswordHash.name)
        .hash('secret');
      await UsersTableTestHelper.addUser({ password });
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
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'thread tidak ditemukan pada database',
      );
    });

    it('should response 403 if the user is not the owner of the reply', async () => {
      const password = await container
        .getInstance(PasswordHash.name)
        .hash('secret');
      await UsersTableTestHelper.addUser({
        id: 'notOwner-user-123',
        username: 'not owner user',
        password,
      });
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ owner: 'user-123' });
      await RepliesTableTestHelper.addReply({});
      const server = await createServer(container);

      // login user
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'not owner user',
          password: 'secret',
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(authResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('User bukanlah pemilik dari reply!');
    });
  });
});
