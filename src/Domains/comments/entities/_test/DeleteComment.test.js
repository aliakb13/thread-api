const DeleteComment = require('../DeleteComment');

describe('DeleteComment object', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      userId: 'user-123',
    };

    // Action & Assert
    expect(() => new DeleteComment(payload)).toThrowError(
      'DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      userId: 'user-123',
      commentId: 123,
    };

    // Action & Assert
    expect(() => new DeleteComment(payload)).toThrowError(
      'DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create the DeleteComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      userId: 'user-123',
      commentId: 'comment-123',
    };

    // Action
    const deleteComment = new DeleteComment(payload);

    // Assert
    expect(deleteComment.threadId).toEqual(payload.threadId);
    expect(deleteComment.userId).toEqual(payload.userId);
    expect(deleteComment.commentId).toEqual(payload.commentId);
  });
});
