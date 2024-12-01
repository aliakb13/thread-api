const AddReplyUseCase = require("../AddReplyUseCase");
const CreateReply = require("../../../Domains/replies/entities/CreateReply");
const CreatedReply = require("../../../Domains/replies/entities/CreatedReply");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");

describe("AddReplyUseCase", () => {
  it("should orchestrating the add reply correctly", async () => {
    // Arrange
    const userPayload = {
      threadId: "thread-123",
      userId: "user-123",
      commentId: "comment-123",
      content: "some content for reply",
    };

    const mockReply = new CreatedReply({
      id: "reply-123",
      content: userPayload.content,
      owner: userPayload.userId,
    });

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // mock function
    mockThreadRepository.checkThreadAvail = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentAvail = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockReply));

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const createdReply = await addReplyUseCase.execute(userPayload);

    // Assert
    expect(createdReply).toStrictEqual(
      new CreatedReply({
        id: "reply-123",
        content: userPayload.content,
        owner: userPayload.userId,
      })
    );

    expect(mockThreadRepository.checkThreadAvail).toHaveBeenCalledWith(
      userPayload.threadId
    );
    expect(mockCommentRepository.checkCommentAvail).toHaveBeenCalledWith(
      userPayload.commentId
    );
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith(
      new CreateReply({
        threadId: userPayload.threadId,
        userId: userPayload.userId,
        commentId: userPayload.commentId,
        content: userPayload.content,
      })
    );
  });
});
