const ValidateUtil = require("../../utils/validate.util");

/*
  Room example
  DAU_NHANH: {
    666: {
      _id: "666",
      mode: "PUBLIC",
      key: null,
      owner: null,
      password: null,
      maxCapacity: 10,
      clients: [
        { _id: 1, name: "Client 1", prepared: false },
        { _id: 2, name: "Client 2", prepared: false },
      ],
    },
  }
*/

class RoomController {
  constructor() {
    this.rooms = {};
  }

  findAllRoom() {
    return this.rooms;
  }

  findRoomsByResource(resource) {
    return this.rooms[resource];
  }

  joinPublicRoom(resource, room, client) {
    const okRequiredFields = ValidateUtil.ensureRequiredFields(
      resource,
      room,
      client
    );
    if (!okRequiredFields) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    let availableRoom = null;

    for (const _id in this.rooms[resource]) {
      const { mode, maxCapacity, clients } = this.rooms[resource][_id];
      if (mode !== "PUBLIC" || clients.length >= maxCapacity) continue;

      availableRoom = _id;
    }

    if (!availableRoom) {
      availableRoom = new Date().getTime();

      this.rooms[resource] = {
        ...this.rooms[resource],
        [availableRoom]: {
          _id: availableRoom,
          mode: "PUBLIC",
          key: null,
          owner: null,
          password: null,
          ...room,
          clients: [],
        },
      };
    }

    const hasClient = this.rooms[resource][availableRoom].clients.find(
      (cl) => cl._id === client._id
    );
    if (!hasClient) {
      this.rooms[resource][availableRoom].clients.push({
        ...client,
        prepared: false,
      });
    }

    return this.rooms[resource][availableRoom];
  }

  leavePublicRoom(resource, room, client) {
    const { _id: roomId } = room;
    const { _id: clientId } = client;

    const okRequiredFields = ValidateUtil.ensureRequiredFields(
      resource,
      roomId,
      clientId
    );
    if (!okRequiredFields) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    const roomsInResource = this.rooms[resource];
    if (!roomsInResource[roomId]) {
      throw Error(`Không tìm thấy tài nguyên ${resource}-${roomId}!`);
    }

    roomsInResource[roomId].clients = roomsInResource[roomId].clients.filter(
      (client) => client._id !== clientId
    );

    const cloneLeftRoom = { ...roomsInResource[roomId] };
    if (roomsInResource[roomId].clients.length <= 0) {
      delete roomsInResource[roomId];
    }

    return cloneLeftRoom;
  }

  preparedRoom(resource, room, client) {
    const { _id: roomId } = room;
    const { _id: clientId, prepared } = client;

    const okRequiredFields = ValidateUtil.ensureRequiredFields(
      resource,
      roomId,
      clientId,
      prepared
    );
    if (!okRequiredFields) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    const roomsInResource = this.rooms[resource];
    if (!roomsInResource[roomId]) {
      throw Error(`Không tìm thấy tài nguyên ${resource}-${roomId}!`);
    }

    roomsInResource[roomId].clients = roomsInResource[roomId].clients.map(
      (client) => ({
        ...client,
        prepared: client._id === clientId ? prepared : client.prepared,
      })
    );

    return roomsInResource[roomId];
  }

  deleteRoom(room) {
    const { resource, _id } = room;
    const okRequiredFields = ValidateUtil.ensureRequiredFields(resource, _id);
    if (!okRequiredFields) {
      throw Error("Không tìm thấy tài nguyên!");
    }

    delete this.rooms[resource][_id];
  }
}

module.exports = new RoomController();
