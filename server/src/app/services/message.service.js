const { MessageRepository } = require("../repositories/message.repository");

class MessageService {
  findMessages(query) {
    return MessageRepository.findMessages(query);
  }

  sendMessage(conversationId, messageInf) {
    return MessageRepository.createMessage(conversationId, messageInf);
  }

  clearConversation(conversationId) {
    MessageRepository.deleteConversation(conversationId);
  }
}

module.exports = {
  MessageService: new MessageService(),
};
