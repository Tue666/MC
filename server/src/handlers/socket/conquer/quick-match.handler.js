const { roomBuilder } = require("../../../app/services/room/room.service");
const ValidateUtil = require("../../../utils/validate.util");

const handleLoadingQuestion = async (io, socket, informRoomChanged, data) => {
  const { mode, resource, room, questionQueryParams = {} } = data;
  const roomService = roomBuilder(mode, resource);
  const resourceInstance = roomService.getResourceInstance();

  if (!resourceInstance.canLoadingQuestion(room._id)) return;

  const { roomWithMatch, questions } = await resourceInstance.loadingQuestion(
    room,
    questionQueryParams
  );

  io.in(roomWithMatch._id).emit(
    "conquer[quick-match]:server-client(loading-question)",
    roomWithMatch,
    questions
  );

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
};
const onLoadingQuestion = (io, socket, informRoomChanged) => {
  socket.on(
    "conquer[quick-match]:client-server(loading-question)",
    async (data) => {
      try {
        await handleLoadingQuestion(io, socket, informRoomChanged, data);
      } catch (error) {
        socket.emit(
          "[ERROR]conquer[quick-match]:server-client(loading-question)",
          error.message
        );
      }
    }
  );
};

const handleClientRaiseHand = async (io, socket, data) => {
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
};
const onClientRaiseHand = (io, socket) => {
  socket.on("conquer[quick-match]:client-server(raise-hand)", async (data) => {
    try {
      await handleClientRaiseHand(io, socket, data);
    } catch (error) {
      socket.emit(
        "[ERROR]conquer[quick-match]:server-client(raise-hand)",
        error.message
      );
    }
  });
};

const handleSelectedAnswer = (io, socket, data) => {
  const { room, question } = data;
  const { _id } = room;
  const { type, value } = question;

  const okRequiredFields = ValidateUtil.ensureRequiredFields(_id, type, value);
  if (!okRequiredFields) {
    throw Error("Không tìm thấy tài nguyên!");
  }

  io.in(_id).emit("conquer[quick-match]:server-client(selected-answer)", data);
};
const onSelectedAnswer = (io, socket) => {
  socket.on("conquer[quick-match]:client-server(selected-answer)", (data) => {
    try {
      handleSelectedAnswer(io, socket, data);
    } catch (error) {
      socket.emit(
        "[ERROR]conquer[quick-match]:server-client(selected-answer)",
        error.message
      );
    }
  });
};

const handleSubmitAnswers = async (io, socket, informRoomChanged, data) => {
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
};
const onSubmitAnswers = (io, socket, informRoomChanged) => {
  socket.on(
    "conquer[quick-match]:client-server(submit-answers)",
    async (data) => {
      try {
        await handleSubmitAnswers(io, socket, informRoomChanged, data);
      } catch (error) {
        socket.emit(
          "[ERROR]conquer[quick-match]:server-client(submit-answers)",
          error.message
        );
      }
    }
  );
};

module.exports = (io, socket, informRoomChanged) => {
  onLoadingQuestion(io, socket, informRoomChanged);

  onClientRaiseHand(io, socket);

  onSelectedAnswer(io, socket);

  onSubmitAnswers(io, socket, informRoomChanged);
};
