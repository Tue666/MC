const { Match } = require("../models/match.model");

class MatchRepository {
  async find(options) {
    const query = Match.find(options.filters);

    if (options.select) {
      query.select(options.select);
    }

    return query;
  }

  async findOne(options) {
    const query = Match.findOne(options.filters);

    if (options.select) {
      query.select(options.select);
    }

    return query;
  }

  async create(matchInf) {
    const match = new Match(matchInf);
    await match.save();

    return match;
  }

  async findByIdAndUpdate(options) {
    const match = await Match.findByIdAndUpdate(
      options._id,
      options.update,
      options.options
    );

    return match;
  }
}

module.exports = {
  MatchRepository: new MatchRepository(),
};
