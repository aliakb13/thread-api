const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');
const UserRepository = require('../../../Domains/users/UserRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete thread correctly', async () => {
    // Arrange
    const userPayload = new DeleteComment({
      threadId: 'thread-123',
      userId: 'user-123',
      commentId: 'comment-123',
    });

    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mock function
    mockUserRepository.checkUserAvail = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.checkThreadAvail = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentAvail = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkIsCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(userPayload);

    // Assert
    expect(mockUserRepository.checkUserAvail).toHaveBeenCalledWith(
      userPayload.userId,
    );
    expect(mockThreadRepository.checkThreadAvail).toHaveBeenCalledWith(
      userPayload.threadId,
    );
    expect(mockCommentRepository.checkCommentAvail).toHaveBeenCalledWith(
      userPayload.commentId,
    );
    expect(mockCommentRepository.checkIsCommentOwner).toHaveBeenCalledWith(
      userPayload.commentId,
      userPayload.userId,
    );
    expect(mockCommentRepository.deleteCommentById).toHaveBeenCalledWith(
      userPayload.commentId,
    );
  });
});
