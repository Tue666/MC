const RoomController = require("../../../app/controllers/room.controller");
const ValidateUtil = require("../../../utils/validate.util");

const raised = {};

const onClientRaiseHand = (io, socket) => {
  socket.on("conquer[quick-match]:client-server(raise-hand)", (data) => {
    try {
      const { room, client } = data;
      const { resource, _id } = room;

      const okRequiredFields = ValidateUtil.ensureRequiredFields(
        resource,
        _id,
        client
      );
      if (!okRequiredFields) {
        throw Error("Không tìm thấy tài nguyên!");
      }

      if (!raised[resource]) raised[resource] = {};

      if (raised[resource][_id]) return;

      raised[resource][_id] = true;

      io.in(_id).emit("conquer[quick-match]:server-client(raise-hand)", client);

      delete raised[resource][_id];
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
      const { room, answered, client } = data;
      const { resource, _id } = room;
      const { correctAnswers } = answered;

      const okRequiredFields = ValidateUtil.ensureRequiredFields(
        resource,
        _id,
        correctAnswers,
        client
      );
      if (!okRequiredFields) {
        throw Error("Không tìm thấy tài nguyên!");
      }

      io.in(_id).emit(
        "conquer[quick-match]:server-client(submit-answers)",
        data
      );

      RoomController.deleteRoom(room);
    } catch (error) {
      socket.emit(
        "[ERROR]conquer[quick-match]:server-client(submit-answers)",
        error.message
      );
    }
  });
};

module.exports = (io, socket) => {
  onClientRaiseHand(io, socket);

  onSelectedAnswer(io, socket);

  onSubmitAnswers(io, socket);
};
