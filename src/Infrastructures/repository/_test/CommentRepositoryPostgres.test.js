const pool = require("../../database/postgres/pool");
const CreateComment = require("../../../Domains/comments/entities/CreateComment");
const CreatedComment = require("../../../Domains/comments/entities/CreatedComment");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("CommentRepositoryPostgres", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe("addComment function", () => {
    it("should persist added comment and return added comment correctly", async () => {
      // Arrange
      const createComment = new CreateComment({
        content: "some content for comment",
        threadId: "thread-123",
        userId: "user-678",
      });

      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "owner of thread",
      });
      await UsersTableTestHelper.addUser({
        id: "user-678",
        username: "user that comment on thread",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        userId: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addComment(createComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById(
        "comment-123"
      );
      expect(comments).toHaveLength(1);
    });

    it("should return return added comment correctly", async () => {
      // Arrange
      const createComment = new CreateComment({
        content: "some content of comment",
        threadId: "thread-123",
        userId: "user-678",
      });

      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "owner of thread",
      });
      await UsersTableTestHelper.addUser({
        id: "user-678",
        username: "user that comment on thread",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const createdComment = await commentRepositoryPostgres.addComment(
        createComment
      );

      // Assert
      expect(createdComment).toStrictEqual(
        new CreatedComment({
          id: "comment-123",
          content: "some content of comment",
          owner: "user-678",
        })
      );
    });
  });

  describe("deleteComment function (soft delete)", () => {
    it("should soft delete the comment", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "owner of the thread",
      });
      await UsersTableTestHelper.addUser({
        id: "user-345",
        username: "user that comment on thread",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-345",
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById("comment-123");

      // Assert
      const threads = await CommentsTableTestHelper.findCommentById(
        "comment-123"
      );
      expect(threads[0].is_deleted).toEqual(true);
    });
  });

  describe("checkCommentAvail function", () => {
    it("should throw NotFoundError when the comment doesnt exist", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.checkCommentAvail("comment-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it("shound not throw error when the comment exist", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "user that owner thread",
      });
      await UsersTableTestHelper.addUser({
        id: "user-678",
        username: "user that comment on thread",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({ owner: "user-678" });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.checkCommentAvail("comment-123")
      ).resolves.not.toThrow();
    });
  });

  describe("checkIsCommentOwner function", () => {
    it("should return AuthorizationError when user is not the owner of the comment", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: "user-123" });
      await CommentsTableTestHelper.addComment({
        threadId: "thread-123",
        owner: "user-123",
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.checkIsCommentOwner("comment-123", "user-678")
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw error when the user is the owner of comment", async () => {
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
        owner: "user-678",
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.checkIsCommentOwner("comment-123", "user-678")
      ).resolves.not.toThrow();
    });
  });
});
