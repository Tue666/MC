const { MatchService } = require("../services/match.service");

class MatchController {
  async calculateResult(req, res, next) {
    try {
      const result = await MatchService.calculateResult(req.body);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const match = await MatchService.create(req.body);

      res.status(201).json({
        msg: `Tạo trận đấu [${match._id}] thành công!`,
        match,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  MatchController: new MatchController(),
};
