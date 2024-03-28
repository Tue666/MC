const { QuickMatch } = require("../models/quick-match.model");

class QuickMatchRepository {
  async find(options) {
    const query = QuickMatch.find(options.filters);

    if (options.select) {
      query.select(options.select);
    }

    if (options.populate) {
      query.populate(options.populate);
    }

    return query;
  }

  async findOne(options) {
    const query = QuickMatch.findOne(options.filters);

    if (options.select) {
      query.select(options.select);
    }

    if (options.populate) {
      query.populate(options.populate);
    }

    return query;
  }

  async findById(queries) {
    const matches = await QuickMatch.aggregate([
      { $match: queries },
      {
        $lookup: {
          from: "matches",
          localField: "_id",
          foreignField: "reference_id",
          as: "match",
        },
      },
      {
        $addFields: {
          match: { $arrayElemAt: ["$match", 0] },
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      {
        $addFields: {
          question: { $arrayElemAt: ["$question", 0] },
        },
      },
    ]);

    return matches?.[0];
  }

  async create(quickMatchInf) {
    const quickMatch = new QuickMatch(quickMatchInf);
    await quickMatch.save();

    return quickMatch;
  }

  async findByIdAndUpdate(options) {
    const operation = await QuickMatch.findByIdAndUpdate(
      options._id,
      options.update,
      options.options
    );

    return operation;
  }
}

module.exports = {
  QuickMatchRepository: new QuickMatchRepository(),
};
