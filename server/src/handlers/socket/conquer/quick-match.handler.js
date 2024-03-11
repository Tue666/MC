const { roomBuilder } = require("../../../app/controllers/room/room.factory");
const {
  QuestionController,
} = require("../../../app/controllers/question.controller");
const ValidateUtil = require("../../../utils/validate.util");
const { ROOM } = require("../../../config/constant");

const onLoadingQuestion = (io, socket) => {
  socket.on(
    "conquer[quick-match]:client-server(loading-question)",
    async (data) => {
      try {
        const { mode, resource, room, questionQueryParams = {} } = data;
        const roomFTR = roomBuilder(mode, resource);

        if (!roomFTR.canLoadingQuestion(room._id)) return;

        const randomQuestions = await QuestionController.findRandomQuestions({
          resources: resource,
          ...questionQueryParams,
        });

        if (randomQuestions.length > 0) {
          const question = randomQuestions[0];

          roomFTR.updateRoom(room._id, {
            state: ROOM.STATE.playing,
            question,
          });
        } else {
          const resetRoom = roomFTR.endPlay(room._id);

          if (resetRoom) {
            io.in(resetRoom._id).emit(
              "conquer:server-client(in-room-forming)",
              resetRoom
            );
          }
        }

        io.in(room._id).emit(
          "conquer[quick-match]:server-client(loading-question)",
          randomQuestions
        );
      } catch (error) {
        socket.emit(
          "[ERROR]conquer[quick-match]:server-client(loading-question)",
          error.message
        );
      }
    }
  );
};

const onClientRaiseHand = (io, socket) => {
  socket.on("conquer[quick-match]:client-server(raise-hand)", (data) => {
    try {
      const { mode, resource, room, client } = data;
      const roomFTR = roomBuilder(mode, resource);
      const resourceInstance = roomFTR.getResourceInstance();

      const hasFirstRaised = resourceInstance.raisedHand(room._id, client._id);
      if (hasFirstRaised) return;

      io.in(room._id).emit(
        "conquer[quick-match]:server-client(raise-hand)",
        client
      );
    } catch (error) {
      socket.emit(
        "[ERROR]conquer[quick-match]:server-client(raise-hand)",
        error.message
      );
    }
  });
};

const onSelectedAnswer = (io, socket) => {
  socket.on("conquer[quick-match]:client-server(selected-answer)", (data) => {
    try {
      const { room, question } = data;
      const { _id } = room;
      const { type, value } = question;

      const okRequiredFields = ValidateUtil.ensureRequiredFields(
        _id,
        type,
        value
      );
      if (!okRequiredFields) {
        throw Error("Không tìm thấy tài nguyên!");
      }

      io.in(_id).emit(
        "conquer[quick-match]:server-client(selected-answer)",
        data
      );
    } catch (error) {
      socket.emit(
        "[ERROR]conquer[quick-match]:server-client(selected-answer)",
        error.message
      );
    }
  });
};

const onSubmitAnswers = (io, socket) => {
  socket.on("conquer[quick-match]:client-server(submit-answers)", (data) => {
    try {
      const { mode, resource, room } = data;
      const roomFTR = roomBuilder(mode, resource);

      io.in(room._id).emit(
        "conquer[quick-match]:server-client(submit-answers)",
        data
      );

      const resetRoom = roomFTR.endPlay(room._id);

      if (resetRoom) {
        io.in(resetRoom._id).emit(
          "conquer:server-client(in-room-forming)",
          resetRoom
        );
      }
    } catch (error) {
      socket.emit(
        "[ERROR]conquer[quick-match]:server-client(submit-answers)",
        error.message
      );
    }
  });
};

module.exports = (io, socket) => {
  onLoadingQuestion(io, socket);

  onClientRaiseHand(io, socket);

  onSelectedAnswer(io, socket);

  onSubmitAnswers(io, socket);
};
