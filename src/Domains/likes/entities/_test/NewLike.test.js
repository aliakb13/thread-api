const NewLike = require('../NewLike');

describe('NewLike class', () => {
  it('should throw error if payload not contain needed property', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
    };

    // Action & Assert
    expect(() => new NewLike(payload)).toThrowError('NEW_LIKE.NOT_CONTAIN.NEEDED_PROPERTY');
  });

  it('should throw error if data type not meet data type specification', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 123,
    };

    // Action & Assert
    expect(() => new NewLike(payload)).toThrowError('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewLike object correctly', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // Action
    const newLike = new NewLike(payload);

    // Assert
    expect(newLike.userId).toEqual(payload.userId);
    expect(newLike.threadId).toEqual(payload.threadId);
    expect(newLike.commentId).toEqual(payload.commentId);
  });
});
