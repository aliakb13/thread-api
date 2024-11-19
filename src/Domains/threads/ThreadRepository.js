class ThreadRepository {
  constructor() {}

  async addThread(title, body, userId) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getThreadById(threadId, userId) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async checkThreadAvail(threadId) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = ThreadRepository;
