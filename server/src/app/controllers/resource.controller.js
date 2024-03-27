const { ResourceService } = require("../services/resource.service");
const { APIError } = require("../../handlers/error.handler");

class ResourceController {
  async update(req, res, next) {
    try {
      const { _id } = req.body;

      const resource = await ResourceService.update(req.body);
      if (!resource) {
        throw new APIError(
          200,
          `Cập nhật tài nguyên [${_id}] không thành công. Kiểm tra lại [${_id}]!`
        );
      }

      res.status(200).json({
        msg: `Cập nhật tài nguyên [${resource._id}] thành công!`,
        resource,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const resource = await ResourceService.create(req.body);

      res.status(201).json({
        msg: `Tạo tài nguyên [${resource._id}] thành công!`,
        resource,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  ResourceController: new ResourceController(),
};
