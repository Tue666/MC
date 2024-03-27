const { roomBuilder } = require("../../../app/services/room/room.service");
const ValidateUtil = require("../../../utils/validate.util");

const onLoadingQuestion = (io, socket, params) => {
  const { informRoomChanged } = params;

  socket.on(
    "conquer[quick-match]:client-server(loading-question)",
    async (data) => {
      try {
        const { mode, resource, room, questionQueryParams = {} } = data;
        const roomService = roomBuilder(mode, resource);
        const resourceInstance = roomService.getResourceInstance();

        if (!resourceInstance.canLoadingQuestion(room._id)) return;

        const { roomWithMatch, questions } =
          await resourceInstance.loadingQuestion(room, questionQueryParams);

        if (questions.length <= 0) {
          const resetRoom = roomService.resetPlay(roomWithMatch._id);

          if (resetRoom) {
            // Inform all client that rooms have changed
            informRoomChanged(io, mode, resource);

            io.in(resetRoom._id).emit(
              "conquer:server-client(in-room-forming)",
              resetRoom
            );
          } else {
            socket.leave(roomWithMatch._id);
          }
        }

        io.in(roomWithMatch._id).emit(
          "conquer[quick-match]:server-client(loading-question)",
          roomWithMatch,
          questions
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
  socket.on("conquer[quick-match]:client-server(raise-hand)", async (data) => {
    try {
      const { mode, resource, room, client } = data;
      const roomService = roomBuilder(mode, resource);
      const resourceInstance = roomService.getResourceInstance();

      const hasFirstRaised = await resourceInstance.raisedHand(
        room._id,
        client._id
      );
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

const onSubmitAnswers = (io, socket, params) => {
  const { informRoomChanged } = params;

  socket.on(
    "conquer[quick-match]:client-server(submit-answers)",
    async (data) => {
      try {
        console.log("submit answers socket");
        const { mode, resource, room, answered, raisedHandId } = data;
        const roomService = roomBuilder(mode, resource);

        const match = await roomService.endPlay(room, answered, raisedHandId);

        io.in(room._id).emit(
          "conquer[quick-match]:server-client(submit-answers)",
          match
        );

        const resetRoom = roomService.resetPlay(room._id);

        if (resetRoom) {
          // Inform all client that rooms have changed
          informRoomChanged(io, mode, resource);

          io.in(resetRoom._id).emit(
            "conquer:server-client(in-room-forming)",
            resetRoom
          );
        } else {
          socket.leave(room._id);
        }
      } catch (error) {
        socket.emit(
          "[ERROR]conquer[quick-match]:server-client(submit-answers)",
          error.message
        );
      }
    }
  );
};

module.exports = (io, socket, params) => {
  onLoadingQuestion(io, socket, params);

  onClientRaiseHand(io, socket);

  onSelectedAnswer(io, socket);

  onSubmitAnswers(io, socket, params);
};
