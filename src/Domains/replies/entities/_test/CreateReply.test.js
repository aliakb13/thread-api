const CreateReply = require("../CreateReply");

describe("A CreateReply entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      content: "some content",
      commentId: "comment-123",
    };

    // Action & Assert
    expect(() => new CreateReply(payload)).toThrowError(
      "CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: 123,
      userId: "user-123",
      commentId: "comment-123",
    };

    // Action & Assert
    expect(() => new CreateReply(payload)).toThrowError(
      "CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create CreateReply object correctly", () => {
    // Arrange
    const payload = {
      content: "some content",
      commentId: "comment-123",
      userId: "user-123",
    };

    // Action
    const { content, commentId, userId } = new CreateReply(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(commentId).toEqual(payload.commentId);
    expect(userId).toEqual(payload.userId);
  });
});
