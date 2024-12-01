const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const createServer = require("../createServer");
const container = require("../../container");
const PasswordHash = require("../../../Applications/security/PasswordHash");

describe("/threads endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
  });

  describe("POST /threads", () => {
    it("should response 201 and persisted thread", async () => {
      // Arrange
      const password = await container
        .getInstance(PasswordHash.name)
        .hash("secret");
      await UsersTableTestHelper.addUser({ password });
      const server = await createServer(container);

      // login user
      const authResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(authResponse.payload);

      const threadPayload = {
        title: "new title for threads",
        body: "new body for threads",
      };

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: threadPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it("should response 400 if the payload not complete", async () => {
      // Arrange
      const password = await container
        .getInstance(PasswordHash.name)
        .hash("secret");
      await UsersTableTestHelper.addUser({ password });
      const server = await createServer(container);

      // login user
      const authResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(authResponse.payload);

      const threadPayload = {
        title: "new title for threads",
      };

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: threadPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "harus mengirimkan title, body dan userId ketika membuat thread"
      );
    });
  });

  describe("GET /threads/{threadId}", () => {
    it("should response 200 and persisted detail thread", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "first user",
      });
      await UsersTableTestHelper.addUser({
        id: "user-345",
        username: "second user",
      });
      await ThreadsTableTestHelper.addThread({ owner: "user-123" });
      await CommentTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-345",
      });
      await CommentTableTestHelper.addComment({
        id: "comment-345",
        owner: "user-345",
        isDeleted: true,
      });

      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-123",
        owner: "user-123",
        date: new Date("2024-11-25"),
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-345",
        commentId: "comment-345",
        owner: "user-345",
        date: new Date("2024-11-26"),
        isDeleted: true,
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/threads/thread-123",
      });

      // Assert
      console.log(response);
      const responseJson = JSON.parse(response.payload);

      //get the replies for testing
      const repliesOne = responseJson.data.thread.comments[0].replies[0];
      const repliesTwo = responseJson.data.thread.comments[1].replies[0];

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(2);

      //replies 1
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(1);
      expect(repliesOne.id).toEqual("reply-123");
      expect(repliesOne.content).toEqual("some content for replies");
      expect(repliesOne.date).toBeDefined();
      expect(repliesOne.username).toEqual("first user");

      //replies 2
      expect(responseJson.data.thread.comments[1].replies).toHaveLength(1);
      expect(repliesTwo.id).toEqual("reply-345");
      expect(repliesTwo.content).toEqual("**balasan telah dihapus**");
      expect(repliesTwo.date).toBeDefined();
      expect(repliesTwo.username).toEqual("second user");
    });

    it("should response 404 when thread not found", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/threads/thread-123",
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "thread tidak ditemukan pada database"
      );
    });
  });
});
