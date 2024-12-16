const AddCommentUseCase = require('../AddCommentUseCase');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment correctly', async () => {
    // Arrange
    const userPayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      content: 'some content that user post as a comment',
    };

    const mockComment = new CreatedComment({
      id: 'comment-123',
      content: userPayload.content,
      owner: userPayload.userId,
    });

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking
    mockThreadRepository.checkThreadAvail = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const createdComment = await addCommentUseCase.execute(userPayload);

    // Assert
    expect(createdComment).toStrictEqual(
      new CreatedComment({
        id: 'comment-123',
        content: userPayload.content,
        owner: userPayload.userId,
      }),
    );

    expect(mockThreadRepository.checkThreadAvail).toHaveBeenCalledWith(
      userPayload.threadId,
    );
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(
      new CreateComment({
        userId: userPayload.userId,
        threadId: userPayload.threadId,
        content: userPayload.content,
      }),
    );
  });
});
