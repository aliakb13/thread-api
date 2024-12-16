const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const PasswordHash = require('../../../Applications/security/PasswordHash');
const createServer = require('../createServer');

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
  });

  describe('POST /comments', () => {
    it('should response 201 and persisted comments', async () => {
      // Arrange
      const password = await container
        .getInstance(PasswordHash.name)
        .hash('secret');
      await UsersTableTestHelper.addUser({ password });
      await ThreadsTableTestHelper.addThread({ id: 'threads-123' });
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
        url: '/threads/threads-123/comments',
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
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 404 if threads not found', async () => {
      // Arrange
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
        method: 'POST',
        url: '/threads/threads-99/comments',
        payload: {
          content: 'some content',
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

    it('should response 400 if payload not contain content', async () => {
      // Arrange
      const password = await container
        .getInstance(PasswordHash.name)
        .hash('secret');
      await UsersTableTestHelper.addUser({ password });
      await ThreadsTableTestHelper.addThread({ id: 'threads-123' });
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
        url: '/threads/threads-123/comments',
        payload: {
          notValid: 'some content',
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
        'harus mengirimkan content, threadId, dan userId ketika membuat comment',
      );
    });

    it('should response 400 if payload is not string', async () => {
      // Arrange
      const password = await container
        .getInstance(PasswordHash.name)
        .hash('secret');
      await UsersTableTestHelper.addUser({ password });
      await ThreadsTableTestHelper.addThread({ id: 'threads-123' });
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
        url: '/threads/threads-123/comments',
        payload: {
          content: 123,
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
        'content, threadId dan userId harus string saat membuat comment',
      );
    });
  });

  describe('DELETE /comments', () => {
    it('should response 200 if all the payload valid and failed if try to delete it again', async () => {
      // Arrange
      const password = await container
        .getInstance(PasswordHash.name)
        .hash('secret');
      await UsersTableTestHelper.addUser({ password });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentTableTestHelper.addComment({ owner: 'user-123' });
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
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // try to delete it again
      const notFoundres = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
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
        'comment tidak ditemukan pada database',
      );
    });

    it('should response 404 if the thread not found', async () => {
      // Arrange
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
        url: '/threads/thread-123/comments/comment-123',
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

    it('should response 403 if user is not the owner of the comment', async () => {
      // Arrange
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
      await CommentTableTestHelper.addComment({ owner: 'user-123' });
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
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'user bukanlah pemilik dari comment!',
      );
    });
  });
});
