const {
  ConversationService,
} = require("../../../app/services/conversation.service");
const { MessageService } = require("../../../app/services/message.service");

// #region TESTING
const handleFindConversations = (io, socket) => {
  const conversations = ConversationService.findConversations();
  const messages = MessageService.findMessages();

  io.to(socket.id).emit(
    "[TESTING]conversation:server-client(find-conversations)",
    conversations,
    messages
  );
};
const onFindConversations = (io, socket) => {
  socket.on("[TESTING]conversation:client-server(find-conversations)", () => {
    try {
      handleFindConversations(io, socket);
    } catch (error) {
      socket.emit(
        "[ERROR][TESTING]conversation:server-client(find-conversations)",
        error.message
      );
    }
  });
};
// #endregion

const handleMessageConversation = (io, socket, data) => {
  const { conversationId, message: messageInf } = data;

  const message = MessageService.sendMessage(conversationId, messageInf);

  io.in(conversationId).emit(
    "conversation:server-client(message-conversation)",
    conversationId,
    message
  );
};
const onMessageConversation = (io, socket) => {
  socket.on("conversation:client-server(message-conversation)", (data) => {
    try {
      handleMessageConversation(io, socket, data);
    } catch (error) {
      socket.emit(
        "[ERROR]conversation:server-client(message-conversation)",
        error.message
      );
    }
  });
};

module.exports = (io, socket) => {
  onFindConversations(io, socket);

  onMessageConversation(io, socket);
};
