const CreateComment = require("../CreateComment");

describe("A CreateComment entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      content: "some content",
      threadId: "thread-123",
    };

    // Action & Assert
    expect(() => new CreateComment(payload)).toThrowError(
      "CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: 123,
      threadId: "thread-123",
      userId: "user-123",
    };

    // Action & Assert
    expect(() => new CreateComment(payload)).toThrowError(
      "CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create CreateComment object correctly", () => {
    // Arrange
    const payload = {
      content: "some content that user write",
      threadId: "thread-123",
      userId: "user-123",
    };

    // Action
    const { content, threadId, userId } = new CreateComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(threadId).toEqual(payload.threadId);
    expect(userId).toEqual(payload.userId);
  });
});
