const { Types } = require("mongoose");
const { AccountService } = require("./account.service");
const { MatchRepository } = require("../repositories/match.repository");
const { APIError } = require("../../handlers/error.handler");
const { ROOM } = require("../../config/constant");
const TimeUtil = require("../../utils/time.util");

const { ObjectId } = Types;

// Playing time compares with overall time
// less than this rate is acceptable and will not be penalized
const PLAYING_TIME_ACCEPTABLE_RATE = 0.75;
// Points will be reduced according to the ratio below
// if any state occurs
const MATCHING_RESULT_RATE = {
  WIN: {
    state: "WIN",
    rate: 0,
  },
  LOSE: {
    state: "LOSE",
    rate: -0.25,
  },
  DISCONNECT: {
    state: "DISCONNECT",
    rate: -0.5,
  },
};
// Client state in these states below will not be changed
const IGNORE_STATE = [MATCHING_RESULT_RATE.DISCONNECT.state];

class MatchService {
  buildClients(clients) {
    if (!clients) return [];

    return clients.map((client) => ({ ...client, _id: ObjectId(client._id) }));
  }

  buildValue(value) {
    return value;
  }

  valueUpdater(field, value) {
    const updater = {};

    if (!updater[field]) return this.buildValue(value);

    return updater[field](value);
  }

  buildUpdate(fields) {
    const builder = {};

    for (const [field, value] of Object.entries(fields)) {
      builder[field] = this.valueUpdater(field, value);
    }

    return builder;
  }

  calculatePenaltyTime(match) {
    const { start_time, end_time } = match;

    const totalTime = end_time - start_time;
    const playingTime = Math.min(
      totalTime,
      TimeUtil.getCurrentTime() - start_time
    );
    const playingTimeAcceptable = totalTime * PLAYING_TIME_ACCEPTABLE_RATE;
    const exceededTime = Math.min(
      totalTime,
      Math.max(0, playingTime - playingTimeAcceptable)
    );

    return { totalTime, playingTime, exceededTime };
  }

  async calculatePenalizePoints(points, penaltyTime) {
    if (!penaltyTime) return points;

    const penalizedPoints = {};
    const { totalTime, exceededTime } = penaltyTime;

    for (const [point, value] of Object.entries(points)) {
      if (typeof value !== "number") continue;

      const penaltyValue = (exceededTime * value) / totalTime;
      penalizedPoints[point] = Math.round(value - Math.abs(penaltyValue));
    }

    return penalizedPoints;
  }

  calculateClientPoints(client, penalizedPoints) {
    const clientPoints = {};
    const clientRate = MATCHING_RESULT_RATE[client.state].rate;

    for (const [point, value] of Object.entries(penalizedPoints)) {
      if (typeof value !== "number") continue;

      clientPoints[point] = Math.round(value + Math.abs(value) * clientRate);
    }

    return clientPoints;
  }

  calculateClients(match, raisedHand, isWinner, penalizedPoints) {
    const { clients } = match.toObject();

    const calculatedClients = clients.map((client) => {
      const isRaisedHand =
        raisedHand && raisedHand.indexOf(client._id.toString()) !== -1;
      const won = isRaisedHand && isWinner;

      if (IGNORE_STATE.indexOf(client.state) === -1) {
        client.state = won
          ? MATCHING_RESULT_RATE.WIN.state
          : MATCHING_RESULT_RATE.LOSE.state;
      }

      const clientPoints = this.calculateClientPoints(client, penalizedPoints);
      client.point_differences = clientPoints;

      return client;
    });

    return calculatedClients;
  }

  async synchronizeAccount(matchId, calculatedClients) {
    const synchronizedAccount = await Promise.all(
      calculatedClients.map(async (client) => {
        const synchronizedClient = await AccountService.synchronizeResult({
          matchId,
          client,
        });

        return synchronizedClient;
      })
    );

    return synchronizedAccount;
  }

  async synchronizeResult(matchId, penaltyTime, calculatedClients) {
    const synchronizedAccount = await this.synchronizeAccount(
      matchId,
      calculatedClients
    );

    const match = await this.update({
      _id: matchId,
      state: ROOM.STATE.end,
      playing_time: penaltyTime.playingTime,
      clients: synchronizedAccount,
    });

    return match;
  }

  async calculateResult(body) {
    const { _id, points, raisedHand, isWinner } = body;

    const match = await MatchRepository.findOne({
      filters: { _id: ObjectId(_id) },
      select: { state: 1, start_time: 1, end_time: 1, clients: 1 },
    });
    if (!match) {
      throw new APIError(200, "Không tìm thấy trận đấu!");
    }

    if (match.state === ROOM.STATE.end) return match;

    const penaltyTime = this.calculatePenaltyTime(match);
    const penalizedPoints = await this.calculatePenalizePoints(
      points,
      penaltyTime
    );
    const calculatedClients = this.calculateClients(
      match,
      raisedHand,
      isWinner,
      penalizedPoints
    );
    const synchronizedMatch = await this.synchronizeResult(
      match._id,
      penaltyTime,
      calculatedClients
    );

    return synchronizedMatch;
  }

  async findForRecovery(body) {
    const { mode, resource } = body;

    const matches = await MatchRepository.find({
      filters: {
        mode,
        resource,
        state: ROOM.STATE.playing,
      },
    });

    return matches;
  }

  async create(body) {
    const { reference_id, clients, ...rest } = body;

    const match = await MatchRepository.create({
      reference_id: ObjectId(reference_id),
      clients: this.buildClients(clients),
      ...rest,
    });

    return match;
  }

  async updateClientState(body) {
    const { _id, clientId, state } = body;

    const update = {
      $set: {
        "clients.$[client].state": state,
      },
    };

    const options = {
      arrayFilters: [{ "client._id": ObjectId(clientId) }],
      new: true,
      runValidators: true,
    };

    const match = await MatchRepository.findByIdAndUpdate({
      _id: ObjectId(_id),
      update,
      options,
    });

    return match;
  }

  async update(body) {
    const { _id, ...rest } = body;

    const options = {
      new: true,
      runValidators: true,
    };

    const match = await MatchRepository.findByIdAndUpdate({
      _id: ObjectId(_id),
      update: this.buildUpdate(rest),
      options,
    });

    return match;
  }
}

module.exports = {
  MatchService: new MatchService(),
};
