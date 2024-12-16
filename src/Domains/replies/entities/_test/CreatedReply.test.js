const CreatedReply = require('../CreatedReply');

describe('A CreatedReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new CreatedReply(payload)).toThrowError(
      'CREATED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'some replies from comment on thread',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new CreatedReply(payload)).toThrowError(
      'CREATED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create CreatedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'some reply',
      owner: 'user-123',
    };

    // Action
    const { id, content, owner } = new CreatedReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
