const Thread = require("../Thread");

describe("Thread object", () => {
  it("should throw error when not contain needed property", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "title",
      body: "body",
      date: {},
    };

    // Action & Assert
    expect(() => new Thread(payload)).toThrowError(
      "THREAD.NOT_CONTAIN_NEEDED PROPERTY"
    );
  });

  it("should throw error when not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "title",
      body: "body",
      date: {},
      username: "udin",
      comments: "something",
    };

    // Action & Assert
    expect(() => new Thread(payload)).toThrowError(
      "THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create object thread correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "title",
      body: "body",
      date: {},
      username: "udin",
      comments: [],
    };

    // Action
    const thread = new Thread(payload);

    // Assert
    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.date).toEqual(payload.date);
    expect(thread.username).toEqual(payload.username);
    expect(thread.comments).toEqual(payload.comments);
  });
});
