const { OperationService } = require("../services/operation.service");
const { APIError } = require("../../handlers/error.handler");

class OperationController {
  async update(req, res, next) {
    try {
      const { _id } = req.body;

      const operation = await OperationService.update(req.body);
      if (!operation) {
        throw new APIError(
          200,
          `Cập nhật hành động [${_id}] không thành công. Kiểm tra lại [${_id}]!`
        );
      }

      res.status(200).json({
        msg: `Cập nhật hành động [${operation._id}] thành công!`,
        operation,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const operation = await OperationService.create(req.body);

      res.status(201).json({
        msg: `Tạo hành động [${operation._id}] thành công!`,
        operation,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  OperationController: new OperationController(),
};
