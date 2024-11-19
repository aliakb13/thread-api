const ReplyRepository = require("../ReplyRepository");

describe("ReplyRepository interface", () => {
  it("should throw error when invoke abstract class", async () => {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action & Assert
    await expect(replyRepository.addReply("")).rejects.toThrowError(
      "REPLY_REPOSITROY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(replyRepository.deleteReplyById("")).rejects.toThrowError(
      "REPLY_REPOSITROY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(replyRepository.checkReplyAvail("")).rejects.toThrowError(
      "REPLY_REPOSITROY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(replyRepository.checkIsReplyOwner("")).rejects.toThrowError(
      "REPLY_REPOSITROY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
