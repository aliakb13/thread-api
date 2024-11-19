const CreateReply = require("../CreateReply");

describe("A CreateReply entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new CreateReply(payload)).toThrowError(
      "CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action & Assert
    expect(() => new CreateReply(payload)).toThrowError(
      "CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create CreateReply object correctly", () => {
    // Arrange
    const payload = {
      content: "some replies from comment on thread",
    };

    // Action
    const { content } = new CreateReply(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});
