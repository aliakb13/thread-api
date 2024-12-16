const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const Thread = require('../../../Domains/threads/entities/Thread');
const Comment = require('../../../Domains/comments/entities/Comment');
const Reply = require('../../../Domains/replies/entities/Reply');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the get detail thread correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const threadPayload = {
      id: 'thread-123',
      title: 'some title',
      body: 'some body',
      date: {},
      username: 'first user',
      comments: [],
    };

    const commentsPayload = [
      {
        id: 'comment-123',
        username: 'second user',
        date: {},
        content: 'some content',
        is_deleted: false,
        replies: [],
      },
      {
        id: 'comment-345',
        username: 'third user',
        date: {},
        content: 'some content',
        is_deleted: true,
        replies: [],
      },
    ];

    const repliesPayload = [
      {
        id: 'reply-123',
        username: 'second user',
        date: {},
        content: 'some content',
        is_deleted: false,
      },
      {
        id: 'reply-345',
        username: 'third user',
        date: {},
        content: 'some content',
        is_deleted: true,
      },
    ];

    const mockThread = new Thread(threadPayload);
    const mockComment = commentsPayload.map((comment) => new Comment(comment));

    const mockReplies = repliesPayload.map((reply) => new Reply(reply));

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.checkThreadAvail = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockReplyRepository.getRepliesByCommentId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockReplies));
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action

    const thread = await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(thread.comments[0].replies).toHaveLength(2);
    expect(thread.comments[1].replies).toHaveLength(2);
    expect(mockThreadRepository.checkThreadAvail).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
    expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledWith(
      'comment-123',
    );
    expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledWith(
      'comment-345',
    );
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
    expect(thread).toStrictEqual(
      new Thread({
        ...threadPayload,
        comments: commentsPayload.map(
          (comment) => new Comment({
            ...comment,
            replies: repliesPayload.map((reply) => new Reply(reply)),
          }),
        ),
      }),
    );
  });

  it('should throw error if use case not contain threadId', async () => {
    // Arrange
    const getDetailThreadUseCase = new GetDetailThreadUseCase({}, {});

    // Action & Assert
    await expect(getDetailThreadUseCase.execute({})).rejects.toThrowError(
      'DETAIL_THREAD_USE_CASE.NOT_CONTAIN_THREAD_ID',
    );
  });

  it('should throw error if thread id is not string', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 123,
    };
    const getDetailThreadUseCase = new GetDetailThreadUseCase({});

    // Action & Assert
    await expect(
      getDetailThreadUseCase.execute(useCasePayload),
    ).rejects.toThrowError(
      'DETAIL_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
});
