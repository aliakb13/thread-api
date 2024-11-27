const Comment = require("../Comment");

describe("A Comment Object", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "user-123",
      date: {},
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError(
      "COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "user-123",
      date: "some date",
      content: "some content",
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError(
      "COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create Comment object correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "user-123",
      date: {},
      content: "some content",
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.content).toEqual(payload.content);
  });
});
