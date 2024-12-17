const GiveLikeCommentUseCase = require('../GiveLikeCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('GiveLikeCommentUseCase', () => {
  it('should orchestrating the give like comment correctly if like is not found', async () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkThreadAvail = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkCommentAvail = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkIsLikeExist = jest.fn(() => Promise.resolve(0));
    mockCommentRepository.addLike = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteLike = jest.fn(() => Promise.resolve());

    const giveLikeCommentUseCase = new GiveLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await giveLikeCommentUseCase.execute(payload);

    // Assert
    expect(mockThreadRepository.checkThreadAvail).toHaveBeenCalledWith(payload.threadId);
    expect(mockCommentRepository.checkCommentAvail).toHaveBeenCalledWith(payload.commentId);
    expect(mockCommentRepository.checkIsLikeExist).toHaveBeenCalledWith(
      payload.userId,
      payload.commentId,
    );
    expect(mockCommentRepository.addLike).toHaveBeenCalledWith(payload.userId, payload.commentId);
    expect(mockCommentRepository.deleteLike).not.toHaveBeenCalled();
  });

  it('should orchestrating the give like comment correctly if like is not found', async () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkThreadAvail = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkCommentAvail = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkIsLikeExist = jest.fn(() => Promise.resolve(1));
    mockCommentRepository.addLike = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteLike = jest.fn(() => Promise.resolve());

    const giveLikeCommentUseCase = new GiveLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await giveLikeCommentUseCase.execute(payload);

    // Assert
    expect(mockThreadRepository.checkThreadAvail).toHaveBeenCalledWith(payload.threadId);
    expect(mockCommentRepository.checkCommentAvail).toHaveBeenCalledWith(payload.commentId);
    expect(mockCommentRepository.checkIsLikeExist).toHaveBeenCalledWith(
      payload.userId,
      payload.commentId,
    );
    expect(mockCommentRepository.deleteLike).toHaveBeenCalledWith(
      payload.userId,
      payload.commentId,
    );
    expect(mockCommentRepository.addLike).not.toHaveBeenCalled();
  });
});
