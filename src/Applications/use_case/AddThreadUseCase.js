const CreatedThread = require('../../Domains/threads/entities/CreateThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    const createThread = new CreatedThread(payload);
    return this._threadRepository.addThread(createThread);
  }
}

module.exports = AddThreadUseCase;
