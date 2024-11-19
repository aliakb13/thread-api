class CommentRepository {
  constructor() {}

  async addComment(content, threadId, userId) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
  async deleteCommentById(commentId) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
  async checkCommentAvail(commentId) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
  async checkIsCommentOwner(commentId, userId) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = CommentRepository;
