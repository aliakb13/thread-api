/* eslint-disable no-unused-vars */

class LikeRepository {
  async checkIsLikeExist(userId, commentId) {
    throw new Error('Like_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async addLike(userId, commentId) {
    throw new Error('Like_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteLike(userId, commentId) {
    throw new Error('Like_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async countLike(commentId) {
    throw new Error('Like_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = LikeRepository;
