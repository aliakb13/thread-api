const pool = require('../../database/postgres/pool');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('CommentRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('addComment function', () => {
    it('should persist added comment and return added comment correctly', async () => {
      // Arrange
      const createComment = new CreateComment({
        content: 'some content for comment',
        threadId: 'thread-123',
        userId: 'user-678',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'owner of thread',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-678',
        username: 'user that comment on thread',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        userId: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentRepositoryPostgres.addComment(createComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById(
        'comment-123',
      );
      expect(comments).toHaveLength(1);
    });

    it('should return return added comment correctly', async () => {
      // Arrange
      const createComment = new CreateComment({
        content: 'some content of comment',
        threadId: 'thread-123',
        userId: 'user-678',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'owner of thread',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-678',
        username: 'user that comment on thread',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const createdComment = await commentRepositoryPostgres.addComment(
        createComment,
      );

      // Assert
      expect(createdComment).toStrictEqual(
        new CreatedComment({
          id: 'comment-123',
          content: 'some content of comment',
          owner: 'user-678',
        }),
      );
    });
  });

  describe('deleteComment function (soft delete)', () => {
    it('should soft delete the comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'owner of the thread',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-345',
        username: 'user that comment on thread',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-345',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById('comment-123');

      // Assert
      const threads = await CommentsTableTestHelper.findCommentById(
        'comment-123',
      );
      expect(threads[0].is_deleted).toEqual(true);
    });
  });

  describe('checkCommentAvail function', () => {
    it('should throw NotFoundError when the comment doesnt exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.checkCommentAvail('comment-123'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('shound not throw error when the comment exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'user that owner thread',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-678',
        username: 'user that comment on thread',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({ owner: 'user-678' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.checkCommentAvail('comment-123'),
      ).resolves.not.toThrow(NotFoundError);
    });

    it('should throw error if user deleted the comment (even just soft delete)', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({
        owner: 'user-123',
        isDeleted: true,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.checkCommentAvail('comment-123'),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('checkIsCommentOwner function', () => {
    it('should return AuthorizationError when user is not the owner of the comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.checkIsCommentOwner('comment-123', 'user-678'),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw error when the user is the owner of comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'user that have thread',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-678',
        username: 'user that comment on thread',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-678',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.checkIsCommentOwner('comment-123', 'user-678'),
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return comments in searched thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'user that have thread',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-678',
        username: 'user that comment on thread',
      });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({
        threadId: 'thread-123',
        owner: 'user-678',
        date: new Date('2024-11-24'),
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-345',
        threadId: 'thread-123',
        owner: 'user-123',
        date: new Date('2024-11-25'),
        isDeleted: true,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action

      const comments = await commentRepositoryPostgres.getCommentByThreadId(
        'thread-123',
      );

      // Assert
      const firstComment = comments[0];
      const secondComment = comments[1];
      expect(comments).toHaveLength(2);

      // first comment
      expect(firstComment.id).toEqual('comment-123');
      expect(firstComment.username).toEqual('user that comment on thread');
      expect(firstComment.date).toBeInstanceOf(Date);
      expect(firstComment.content).toEqual('some content');

      // second comment
      expect(secondComment.id).toEqual('comment-345');
      expect(secondComment.username).toEqual('user that have thread');
      expect(secondComment.date).toBeInstanceOf(Date);
      expect(secondComment.content).toEqual('**komentar telah dihapus**');
    });
  });

  describe('checkIsLikeExist function', () => {
    it('should return 0 if searched like not exist or not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const foundNum = await commentRepositoryPostgres.checkIsLikeExist('', '');

      // Assert
      expect(foundNum).toEqual(0);
    });

    it('should return 1 if searched like is found or exist', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const foundNum = await commentRepositoryPostgres.checkIsLikeExist('user-123', 'comment-123');

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
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addLike(userLike);

      // Assert
      const like = await LikesTableTestHelper.findLikeById('like-123');
      expect(like).toHaveLength(1);
    });
  });

  describe('deleteLike function', () => {
    it('should delete like properly', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteLike('user-123', 'comment-123');

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

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const { count } = await commentRepositoryPostgres.countLike('comment-123');

      // Assert
      expect(count).toEqual('2'); // sementara pake string, kalo butuh int jangan lupa diganti
    });
  });
});
