const { Types } = require("mongoose");
const {
  QuickMatchRepository,
} = require("../repositories/quick-match.repository");
const { APIError } = require("../../handlers/error.handler");

const { ObjectId } = Types;

class QuickMatchService {
  buildId(_id) {
    return ObjectId(_id);
  }

  buildIds(_ids) {
    if (!_ids) return [];

    return _ids.map((_id) => this.buildId(_id));
  }

  buildOwnerValue(value) {
    const owner = ObjectId(value);
    return owner;
  }

  buildFirstRaisedHandValue(value) {
    const firstRaisedHand = ObjectId(value);
    return firstRaisedHand;
  }

  buildValue(value) {
    return value;
  }

  valueUpdater(field, value) {
    const updater = {
      owner: this.buildOwnerValue,
      first_raised_hand: this.buildFirstRaisedHandValue,
    };

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

  calculateCorrectAnswer(body) {
    const { values, answered } = body;

    if (answered.length <= 0)
      return { totalValue: values.length, totalCorrect: values.length * -1 };

    let totalCorrect = 0;

    for (let i = 0; i < answered.length; i++) {
      const answer = answered[i];
      const isCorrect = values.indexOf(answer) !== -1;

      totalCorrect += isCorrect ? 1 : -1;
    }

    return { totalValue: values.length, totalCorrect };
  }

  async calculatePoints(body) {
    const { _id, answered } = body;

    const quickMatch = await QuickMatchRepository.findOne({
      filters: { _id: ObjectId(_id) },
      populate: {
        path: "question",
        select: {
          values: 1,
          gold_point: 1,
          experience_point: 1,
        },
      },
      select: { question: 1 },
    });
    if (!quickMatch) {
      throw new APIError(200, "Không tìm thấy đấu nhanh!");
    }

    const points = {};
    const quickMatchObj = quickMatch.toObject();
    const { question } = quickMatchObj;
    const { totalValue, totalCorrect } = this.calculateCorrectAnswer({
      values: question.values,
      answered,
    });

    for (const [point, value] of Object.entries(question)) {
      if (typeof value !== "number") continue;

      const remainValue = (totalCorrect * value) / totalValue;
      points[point] = Math.round(remainValue);
    }

    return {
      points,
      isWinner: totalValue === totalCorrect,
    };
  }

  async findForRecovery(body) {
    const { _ids } = body;

    const quickMatches = await QuickMatchRepository.find({
      filters: {
        _id: { $in: this.buildIds(_ids) },
      },
      populate: {
        path: "question",
      },
    });

    return quickMatches;
  }

  async findById(params) {
    const { _id } = params;

    const queries = {
      _id: ObjectId(_id),
    };

    const quickMatch = await QuickMatchRepository.findById(queries);

    return quickMatch;
  }

  async create(body) {
    const { owner, question, ...rest } = body;

    const quickMatch = await QuickMatchRepository.create({
      owner: ObjectId(owner),
      question: ObjectId(question),
      ...rest,
    });

    return quickMatch;
  }

  async update(body) {
    const { _id, ...rest } = body;

    const options = {
      new: true,
      runValidators: true,
    };

    const quickMatch = await QuickMatchRepository.findByIdAndUpdate({
      _id: ObjectId(_id),
      update: this.buildUpdate(rest),
      options,
    });

    return quickMatch;
  }
}

module.exports = {
  QuickMatchService: new QuickMatchService(),
};
