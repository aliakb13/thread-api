const GetDetailThreadUseCase = require("../GetDetailThreadUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const Thread = require("../../../Domains/threads/entities/Thread");
const Comment = require("../../../Domains/comments/entities/Comment");

describe("GetDetailThreadUseCase", () => {
  it("should orchestrating the get detail thread correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
    };

    const threadPayload = {
      id: "thread-123",
      title: "some title",
      body: "some body",
      date: {},
      username: "first user",
      comments: [],
    };

    const commentPayload = [
      {
        id: "comment-123",
        username: "second user",
        date: {},
        content: "some content",
        is_deleted: false,
      },
      {
        id: "comment-345",
        username: "third user",
        date: {},
        content: "some content",
        is_deleted: true,
      },
    ];

    const mockThread = new Thread(threadPayload);
    const mockComment = commentPayload.map((comment) => new Comment(comment));

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkThreadAvail = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action

    const thread = await getDetailThreadUseCase.execute(useCasePayload);

    // Assert

    expect(thread.comments.length).toEqual(2);
    expect(mockThreadRepository.checkThreadAvail).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(thread).toStrictEqual(
      new Thread({
        ...mockThread,
        comments: mockComment,
      })
    );
  });

  it("should throw error if use case not contain threadId", async () => {
    // Arrange
    const getDetailThreadUseCase = new GetDetailThreadUseCase({}, {});

    // Action & Assert
    await expect(getDetailThreadUseCase.execute({})).rejects.toThrowError(
      "DETAIL_THREAD_USE_CASE.NOT_CONTAIN_THREAD_ID"
    );
  });

  it("should throw error if thread id is not string", async () => {
    // Arrange
    const useCasePayload = {
      threadId: 123,
    };
    const getDetailThreadUseCase = new GetDetailThreadUseCase({});

    // Action & Assert
    await expect(
      getDetailThreadUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      "DETAIL_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });
});
