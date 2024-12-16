const AddThreadUseCase = require('../AddThreadUseCase');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread correctly', async () => {
    // Arrange
    const userPayload = {
      userId: 'user-123',
      title: 'some title that user post on thread',
      body: 'some body that user post on thread',
    };

    const mockThread = new CreatedThread({
      id: 'thread-123',
      title: userPayload.title,
      owner: userPayload.userId,
    });

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();

    // mock function
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    // creating use case instance
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const createdThread = await addThreadUseCase.execute(userPayload);

    // Assert
    expect(createdThread).toStrictEqual(
      new CreatedThread({
        id: 'thread-123',
        title: userPayload.title,
        owner: userPayload.userId,
      }),
    );

    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(
      new CreateThread({
        userId: userPayload.userId,
        title: userPayload.title,
        body: userPayload.body,
      }),
    );
  });
});
