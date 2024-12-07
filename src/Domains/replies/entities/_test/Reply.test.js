const Reply = require("../Reply");

describe("Reply object", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "some reply content",
      date: new Date(),
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError(
      "REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload noot meet data type specification", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "some reply content",
      date: "some date",
      username: "ujang",
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError(
      "REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should contain actual value if is_deleted property false", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "not deleted content",
      date: new Date(),
      username: "ujang",
      is_deleted: false,
    };

    // Action
    const reply = new Reply(payload);

    // Assert
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual(payload.content);
    expect(reply.date).toEqual(payload.date);
    expect(reply.username).toEqual(payload.username);
  });

  it("should contain **balasan telah dihapus** value if is_deleted property true", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "will be deleted",
      date: new Date(),
      username: "ujang",
      is_deleted: true,
    };

    // Action
    const reply = new Reply(payload);

    // Assert
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual("**balasan telah dihapus**");
    expect(reply.date).toEqual(payload.date);
    expect(reply.username).toEqual(payload.username);
  });

  it("should create Reply object correctly", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "some reply content",
      date: new Date(),
      username: "ujang",
    };

    // Action
    const reply = new Reply(payload);

    // Assert
    expect(reply).toBeInstanceOf(Reply);
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual(payload.content);
    expect(reply.date).toEqual(payload.date);
    expect(reply.content).toEqual(payload.content);
    expect(reply.username).toEqual(payload.username);
  });

  it("should return plain object if toJson() called", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "some reply content",
      date: new Date("2024-11-25"),
      username: "ujang",
    };

    // Action
    const reply = new Reply(payload).toJson();

    // Assert
    expect(reply).toStrictEqual({
      id: "reply-123",
      content: "some reply content",
      date: new Date("2024-11-25"),
      username: "ujang",
    });
  });
});
