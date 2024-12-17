const LikeRepository = require('../LikeRepository');

describe('LikeRepository interface', () => {
  it('should throw error when invoke abstract behaviour', async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action & Assert
    await expect(likeRepository.addLike('', '', '')).rejects.toThrowError('Like_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.checkIsLikeExist('', '', '')).rejects.toThrowError('Like_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.countLike('', '', '')).rejects.toThrowError('Like_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.deleteLike('', '')).rejects.toThrowError('Like_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
