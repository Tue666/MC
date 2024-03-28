const { QuickMatchService } = require("../services/quick-match.service");

class QuickMatchController {
  async findById(req, res, next) {
    try {
      const quickMatch = await QuickMatchService.findById(req.params);

      res.status(201).json({
        quickMatch,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const quickMatch = await QuickMatchService.create(req.body);

      res.status(201).json({
        msg: `Tạo đấu nhanh [${quickMatch._id}] thành công!`,
        quickMatch,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  QuickMatchController: new QuickMatchController(),
};
