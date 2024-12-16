const CreateThread = require('../CreateThread');

describe('A CreateThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'some title',
      body: 'some body',
    };

    // Action & Assert
    expect(() => new CreateThread(payload)).toThrowError(
      'CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'some title',
      body: 123,
      userId: 'user-123',
    };

    // Action & Assert
    expect(() => new CreateThread(payload)).toThrowError(
      'CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create CreateThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'some title',
      body: 'some body that user input',
      userId: 'user-123',
    };

    // Action
    const { title, body, userId } = new CreateThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(userId).toEqual(payload.userId);
  });
});
