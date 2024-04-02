const { MESSAGE } = require("../../config/constant");
const TimeUtil = require("../../utils/time.util");

class MessageRepository {
  constructor() {
    // Messages example
    // this.messages = {
    //   1500859035207@1711857790024: [
    //     {
    //       _id: "1@1711857790024",
    //       sender: {
    //         _id: "1",
    //         name: "Pihe 1",
    //         avatar: "",
    //       },
    //       content: "Hello",
    //     },
    //     {
    //       _id: "2@1711857790024",
    //       sender: {
    //         _id: "2",
    //         name: "Pihe 2",
    //         avatar: "",
    //       },
    //       content: "Hi",
    //     },
    //   ],
    // };

    this.messages = {};
  }

  findMessages(query) {
    if (!query) return this.messages;

    const messages = Object.entries(this.messages)
      .filter(([key, value]) => query && query(value))
      .reduce((acc, [key, value]) => {
        acc[key] = value;

        return acc;
      }, {});

    return messages;
  }

  buildMessageId(sender) {
    const currentTime = TimeUtil.getCurrentTime();

    return `${sender._id}${MESSAGE.ID_CONNECTOR}${currentTime}`;
  }

  createMessage(conversationId, messageInf) {
    const messageId = this.buildMessageId(messageInf.sender);

    const message = {
      _id: messageId,
      ...messageInf,
    };

    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }

    this.messages[conversationId].push(message);

    return message;
  }

  deleteConversation(conversationId) {
    if (!this.messages[conversationId]) return;

    delete this.messages[conversationId];
  }
}

module.exports = {
  MessageRepository: new MessageRepository(),
};
