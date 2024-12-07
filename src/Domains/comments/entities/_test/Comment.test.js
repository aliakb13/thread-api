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
      replies: [],
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError(
      "COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should contain actual value if is_deleted property false", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "user-123",
      date: {},
      content: "not deleted content",
      replies: [],
      is_deleted: false,
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.content).toEqual(payload.content);
    expect(comment.replies).toEqual(payload.replies);
  });

  it("should contain **komentar telah dihapus** value if is_deleted property true", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "user-123",
      date: {},
      content: "will be deleted",
      replies: [],
      is_deleted: true,
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.content).toEqual("**komentar telah dihapus**");
    expect(comment.replies).toEqual(payload.replies);
  });

  it("should create Comment object correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "user-123",
      date: {},
      content: "some content",
      replies: [],
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment).toBeInstanceOf(Comment);
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.content).toEqual(payload.content);
    expect(comment.replies).toEqual(payload.replies);
  });

  it("should convert to plain object if toJson() called", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "user-123",
      date: {},
      content: "some content",
      replies: [],
    };

    // Action
    const comment = new Comment(payload).toJson();

    // Assert
    expect(comment).toStrictEqual({
      id: "comment-123",
      username: "user-123",
      date: {},
      content: "some content",
      replies: [],
    });
  });
});
