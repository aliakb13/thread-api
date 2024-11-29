const DeleteReply = require("../DeleteReply");

describe("DeleteReply object", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      threadId: "thread-123",
      commentId: "comment-123",
      replyId: "reply-123",
    };

    // Action & Assert
    expect(() => new DeleteReply(payload)).toThrow(
      "DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      threadId: "thread-123",
      commentId: "comment-123",
      replyId: "reply-123",
      userId: 123,
    };

    // Action & Assert
    expect(() => new DeleteReply(payload)).toThrow(
      "DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create DeleteReply object correctly", () => {
    // Arrange
    const payload = {
      threadId: "thread-123",
      commentId: "comment-123",
      replyId: "reply-123",
      userId: "user-123",
    };

    // Action
    const deleteReply = new DeleteReply(payload);

    // Assert
    expect(deleteReply.threadId).toEqual(payload.threadId);
    expect(deleteReply.commentId).toEqual(payload.commentId);
    expect(deleteReply.replyId).toEqual(payload.replyId);
    expect(deleteReply.userId).toEqual(payload.userId);
  });
});
