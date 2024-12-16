const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const DeleteReply = require('../../../Domains/replies/entities/DeleteReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply correctly', async () => {
    // Arrange
    const userPayload = new DeleteReply({
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      userId: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.checkThreadAvail = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentAvail = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkReplyAvail = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkIsReplyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(userPayload);

    // Assert
    expect(mockThreadRepository.checkThreadAvail).toHaveBeenCalledWith(
      userPayload.threadId,
    );
    expect(mockCommentRepository.checkCommentAvail).toHaveBeenCalledWith(
      userPayload.commentId,
    );
    expect(mockReplyRepository.checkReplyAvail).toHaveBeenCalledWith(
      userPayload.replyId,
    );
    expect(mockReplyRepository.checkIsReplyOwner).toHaveBeenCalledWith(
      userPayload.replyId,
      userPayload.userId,
    );
    expect(mockReplyRepository.deleteReplyById).toHaveBeenCalledWith(
      userPayload.replyId,
    );
  });
});
