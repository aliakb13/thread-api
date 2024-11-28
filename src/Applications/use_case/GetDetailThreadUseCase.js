class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);

    const { threadId } = useCasePayload;

    await this._threadRepository.checkThreadAvail(threadId);
    const comments = await this._commentRepository.getCommentByThreadId(
      threadId
    );
    const thread = await this._threadRepository.getThreadById(threadId);
    thread.comments = comments;
    return thread;
  }

  _verifyPayload({ threadId }) {
    if (!threadId) {
      throw new Error("DETAIL_THREAD_USE_CASE.NOT_CONTAIN_THREAD_ID");
    }

    if (typeof threadId !== "string") {
      throw new Error(
        "DETAIL_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }
  }
}

module.exports = GetDetailThreadUseCase;
