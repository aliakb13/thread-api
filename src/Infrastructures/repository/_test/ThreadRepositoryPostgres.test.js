const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const pool = require("../../database/postgres/pool");
const CreateThread = require("../../../Domains/threads/entities/CreateThread");
const CreatedThread = require("../../../Domains/threads/entities/CreatedThread");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const Comment = require("../../../Domains/comments/entities/Comment");

describe("ThreadRepositoryPostgres", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe("addThread function", () => {
    it("should persist addThread and return createdThread correctly", async () => {
      // Arrange
      const createThread = new CreateThread({
        title: "some title",
        body: "some body",
        userId: "user-123",
      });

      await UsersTableTestHelper.addUser({ id: "user-123" });

      const fakeIdGenerator = () => "123"; //stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(createThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById("thread-123");
      expect(threads).toHaveLength(1);
    });

    it("should return createdThread correctly", async () => {
      // Arrange
      const createThread = new CreateThread({
        title: "some title",
        body: "some body",
        userId: "user-123",
      });

      await UsersTableTestHelper.addUser({ id: "user-123" });

      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const createdThread = await threadRepositoryPostgres.addThread(
        createThread
      );
      expect(createdThread).toStrictEqual(
        new CreatedThread({
          id: "thread-123",
          title: "some title",
          owner: "user-123",
        })
      );
    });
  });

  describe("getThreadById function", () => {
    it("should return NotFoundError if the searched thread not found", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "something-123" });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getThreadById("someThread-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should return searched thread if found with comment not deleted", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "user that have thread",
      });
      await UsersTableTestHelper.addUser({
        id: "user-678",
        username: "user that comment on thread",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-678",
      });

      await CommentsTableTestHelper.addComment({
        id: "comment-345",
        threadId: "thread-123",
        owner: "user-123",
        isDeleted: true,
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById("thread-123");

      // Assert

      // check the thread
      // hardcode comments for testing purposes
      const firstComment = thread.comments[0];
      const secondComment = thread.comments[1];

      expect(thread.id).toEqual("thread-123");
      expect(thread.title).toEqual("some title");
      expect(thread.body).toEqual("some body");
      expect(thread.date).toBeDefined();
      expect(thread.date).not.toBeNull();
      expect(thread.username).toEqual("user that have thread");
      expect(thread.comments).toHaveLength(2);

      // check the first comment
      expect(firstComment.id).toEqual("comment-123");
      expect(firstComment.username).toEqual("user that comment on thread");
      expect(firstComment.date).not.toBeNull();
      expect(firstComment.content).toEqual("some content");

      // check the second comment
      expect(secondComment.id).toEqual("comment-345");
      expect(secondComment.username).toEqual("user that have thread");
      expect(secondComment.date).not.toBeNull();
      expect(secondComment.content).toEqual("**komentar telah dihapus**");
    });
  });
});
