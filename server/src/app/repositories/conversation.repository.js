const { CONVERSATION } = require("../../config/constant");
const NumberUtil = require("../../utils/number.util");
const TimeUtil = require("../../utils/time.util");

class ConversationRepository {
  constructor() {
    // Conversations example
    // this.conversations = {
    //   1500859035207@1711857790024: {
    //     _id: "1500859035207@1711857790024",
    //     title: "For Fun",
    //     clients: [
    //       { socketId: "1", _id: "1", name: "Client 1", avatar: "avatar_url" },
    //     ],
    //   },
    // };

    this.conversations = {};
  }

  findConversations(query) {
    if (!query) return this.conversations;

    const conversations = Object.entries(this.conversations)
      .filter(([key, value]) => query && query(value))
      .reduce((acc, [key, value]) => {
        acc[key] = value;

        return acc;
      }, {});

    return conversations;
  }

  findConversationById(conversationId) {
    const conversation = this.conversations[conversationId];
    if (!conversation) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    return conversation;
  }

  buildConversationId() {
    const currentTime = TimeUtil.getCurrentTime();

    return `${NumberUtil.randomNumber(1, currentTime)}${
      CONVERSATION.ID_CONNECTOR
    }${currentTime}`;
  }

  createConversation(conversationInf) {
    const conversationId = this.buildConversationId();

    this.conversations[conversationId] = {
      _id: conversationId,
      ...this.buildDefaultConversation(),
      ...conversationInf,
    };

    return this.conversations[conversationId];
  }

  buildDefaultConversation() {
    return {
      createdAt: new Date().toISOString(),
      clients: [],
    };
  }

  updateConversation(conversationId, conversationInf) {
    if (!this.conversations[conversationId]) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    this.conversations[conversationId] = {
      ...this.conversations[conversationId],
      ...conversationInf,
    };

    return this.conversations[conversationId];
  }

  deleteConversation(conversationId) {
    if (!this.conversations[conversationId]) return;

    delete this.conversations[conversationId];
  }

  createClient(conversationId, clientInf) {
    if (!this.conversations[conversationId]) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    const clientInConversation = this.conversations[
      conversationId
    ].clients.find((client) => client._id === clientInf._id);
    if (clientInConversation) {
      return this.updateClient(conversationId, {
        ...clientInConversation,
        ...clientInf,
      });
    }

    this.conversations[conversationId].clients.push(clientInf);

    return this.conversations[conversationId];
  }

  updateClient(conversationId, clientInf) {
    if (!this.conversations[conversationId]) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    this.conversations[conversationId].clients = this.conversations[
      conversationId
    ].clients.map((client) =>
      client._id === clientInf._id ? { ...client, ...clientInf } : client
    );

    return this.conversations[conversationId];
  }

  deleteClient(conversationId, clientId) {
    if (!this.conversations[conversationId]) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    this.conversations[conversationId].clients = this.conversations[
      conversationId
    ].clients.filter((client) => client._id !== clientId);

    const cloneConversation = { ...this.conversations[conversationId] };

    if (this.conversations[conversationId].clients.length <= 0) {
      this.deleteConversation(conversationId);
    }

    return cloneConversation;
  }
}

module.exports = {
  ConversationRepository: new ConversationRepository(),
};
