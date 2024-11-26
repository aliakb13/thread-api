const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const CreateReply = require("../../../Domains/replies/entities/CreateReply");
const CreatedReply = require("../../../Domains/replies/entities/CreatedReply");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("ReplyRepositoryPostgres", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe("addReply function", () => {
    it("should persist added reply and return added reply correctly", async () => {
      // Arrange
      const createReply = new CreateReply({
        content: "some content",
        userId: "user-456",
        threadId: "thread-123",
        commentId: "comment-123",
      });

      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "user that have thread",
      });
      await UsersTableTestHelper.addUser({
        id: "user-345",
        username: "user that comment on thread",
      });
      await UsersTableTestHelper.addUser({
        id: "user-456",
        username: "user that reply on comment",
      });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({
        threadId: "thread-123",
        owner: "user-345",
      });

      const fakeIdGenerator = () => "123";
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await replyRepositoryPostgres.addReply(createReply);

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById("reply-123");
      expect(replies).toHaveLength(1);
    });

    it("should return added reply correctly", async () => {
      // Arrange
      const createReply = new CreateReply({
        content: "some content",
        userId: "user-456",
        threadId: "thread-123",
        commentId: "comment-123",
      });

      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "user that have thread",
      });
      await UsersTableTestHelper.addUser({
        id: "user-345",
        username: "user that comment on thread",
      });
      await UsersTableTestHelper.addUser({
        id: "user-456",
        username: "user that reply on comment",
      });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({
        threadId: "thread-123",
        owner: "user-345",
      });

      const fakeIdGenerator = () => "123";
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const createdReply = await replyRepositoryPostgres.addReply(createReply);

      // Assert
      expect(createdReply).toStrictEqual(
        new CreatedReply({
          id: "reply-123",
          content: "some content",
          owner: "user-456",
        })
      );
    });
  });

  describe("deleteReplyById function (soft delete)", () => {
    it("should soft delete the comment", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "user that have thread",
      });
      await UsersTableTestHelper.addUser({
        id: "user-345",
        username: "user that comment on thread",
      });
      await UsersTableTestHelper.addUser({
        id: "user-567",
        username: "user that reply on comment",
      });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ owner: "user-345" });
      await RepliesTableTestHelper.addReply({
        owner: "user-567",
        isDeleted: true,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReplyById("comment-123");

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById("reply-123");
      expect(replies[0].is_deleted).toEqual(true);
    });
  });

  describe("checkReplyAvail function", () => {
    it("should throw NotFoundError when reply not found", async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.checkReplyAvail("randomReply-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when reply is found", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dummy user",
      });
      await ThreadsTableTestHelper.addThread({ owner: "user-123" });
      await CommentsTableTestHelper.addComment({ owner: "user-123" });
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.checkReplyAvail("reply-123")
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("checkIsReplyOwner function", () => {
    it("should throw AuthorizationError when user is not the owner of the reply", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dummy user",
      });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ owner: "user-123" });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.checkIsReplyOwner("reply-345", "user-123")
      ).rejects.toThrow(AuthorizationError);
    });

    it("should not throw error when user is the owner of reply", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dummy user",
      });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ owner: "user-123" });
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.checkIsReplyOwner("reply-123", "user-123")
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe("getRepliesByCommentId", () => {
    it("should return replies in searched comment correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "first user",
      });
      await UsersTableTestHelper.addUser({
        id: "user-345",
        username: "second user",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-345",
        threadId: "thread-123",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-123",
        owner: "user-123",
        content: "this is content in first reply",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-345",
        commentId: "comment-123",
        owner: "user-345",
        isDeleted: true,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentId(
        "comment-123"
      );

      // Assert
      const firstReply = replies[0];
      const secondReply = replies[1];
      expect(replies).toHaveLength(2);

      // first reply
      expect(firstReply.id).toEqual("reply-123");
      expect(firstReply.content).toEqual("this is content in first reply");
      expect(firstReply.date).toBeInstanceOf(Date);
      expect(firstReply.username).toEqual("first user");

      // second reply
      expect(secondReply.id).toEqual("reply-345");
      expect(secondReply.content).toEqual("**balasan telah dihapus**");
      expect(secondReply.date).toBeInstanceOf(Date);
      expect(secondReply.username).toEqual("second user");
    });
  });
});
