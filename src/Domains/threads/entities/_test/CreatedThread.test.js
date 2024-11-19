const CreatedThread = require("../CreatedThread");

describe("A CreatedThread entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "some title",
    };

    // Action & Assert
    expect(() => new CreatedThread(payload)).toThrowError(
      "CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: 213,
      owner: "user-123",
    };

    // Action & Assert
    expect(() => new CreatedThread(payload)).toThrowError(
      "CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create CreatedThread object correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "some title",
      owner: "user-123",
    };

    // Action
    const { id, title, owner } = new CreatedThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
