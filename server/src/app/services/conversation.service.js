const { MessageService } = require("./message.service");
const {
  ConversationRepository,
} = require("../repositories/conversation.repository");
const ValidateUtil = require("../../utils/validate.util");

class ConversationService {
  findConversations(query) {
    return ConversationRepository.findConversations(query);
  }

  joinConversation(conversationInf, clientInf) {
    const okRequiredFields = ValidateUtil.ensureRequiredFields(
      conversationInf,
      clientInf,
      clientInf._id
    );
    if (!okRequiredFields) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    let availableConversation = null;

    if (!conversationInf._id) {
      // Client is creating a new conversation
      const createdConversation =
        ConversationRepository.createConversation(conversationInf);

      availableConversation = createdConversation._id;
    } else {
      // Client is joining a conversation
      const conversation = ConversationRepository.findConversationById(
        conversationInf._id
      );

      availableConversation = conversation._id;
    }

    const joinedConversation = ConversationRepository.createClient(
      availableConversation,
      clientInf
    );

    return joinedConversation;
  }

  leaveConversation(conversationId, clientId) {
    const okRequiredFields = ValidateUtil.ensureRequiredFields(
      conversationId,
      clientId
    );
    if (!okRequiredFields) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    const leftConversation = ConversationRepository.deleteClient(
      conversationId,
      clientId
    );

    return leftConversation;
  }

  clearConversation(conversationId) {
    MessageService.clearConversation(conversationId);
    ConversationRepository.deleteConversation(conversationId);
  }
}

module.exports = {
  ConversationService: new ConversationService(),
};
