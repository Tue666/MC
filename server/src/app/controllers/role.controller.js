const { RoleService } = require("../services/role.service");
const { APIError } = require("../../handlers/error.handler");

class RoleController {
  async update(req, res, next) {
    try {
      const { _id } = req.body;

      const role = await RoleService.update(req.body);
      if (!role) {
        throw new APIError(
          200,
          `Cập nhật vai trò [${_id}] không thành công. Kiểm tra lại [${_id}]!`
        );
      }

      res.status(200).json({
        msg: `Cập nhật vai trò [${role._id}] thành công!`,
        role,
      });
    } catch (error) {
      next(error);
    }
  }

  async findByIds(req, res, next) {
    try {
      const roles = await RoleService.findByIds(req.body);

      res.status(200).json({
        roles,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const role = await RoleService.create(req.body);

      res.status(201).json({
        msg: `Tạo vai trò [${role._id}] thành công!`,
        role,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  RoleController: new RoleController(),
};
