const { Resource, RESOURCE_STATUS } = require("../models/resource.model");
const StringUtil = require("../../utils/string.util");
const ValidateUtil = require("../../utils/validate.util");

class ResourceController {
  async changeStatus(req, res, next) {
    try {
      let { _id, status } = req.body;

      const okRequiredFields = ValidateUtil.ensureRequiredFields(_id, status);
      if (!okRequiredFields) {
        next({ status: 200, msg: "Các giá trị bắt buộc không được bỏ trống!" });
        return;
      }

      _id = StringUtil.toStringID(_id);
      status = status.toUpperCase();
      const okIncludeOne = ValidateUtil.ensureIncludeOne(
        status,
        Object.values(RESOURCE_STATUS)
      );
      if (!okIncludeOne) {
        next({
          status: 200,
          msg: `Trạng thái [${status}] không tồn tại. Hãy thử lại với: ${Object.values(
            RESOURCE_STATUS
          ).join(", ")}.`,
        });
        return;
      }

      const resource = await Resource.findByIdAndUpdate(
        _id,
        {
          $set: {
            status,
          },
        },
        {
          new: true,
        }
      );
      if (!resource) {
        next({
          status: 200,
          msg: `Cập nhật tài nguyên [${_id}] không thành công. Kiểm tra lại [${_id}]!`,
        });
        return;
      }

      res.status(200).json({
        msg: `Cập nhật tài nguyên [${_id}] thành công!`,
        resource,
      });
    } catch (error) {
      next({ status: 500, msg: error.message });
    }
  }

  async insert(req, res, next) {
    try {
      let { name, operations, description, priority, difficulty } = req.body;

      const okRequiredFields = ValidateUtil.ensureRequiredFields(name);
      if (!okRequiredFields) {
        next({ status: 200, msg: "Các giá trị bắt buộc không được bỏ trống!" });
        return;
      }

      const _id = StringUtil.toStringID(name);
      const resourceExisted = await Resource.findOne({ _id });
      if (resourceExisted) {
        next({ status: 200, msg: `Tài nguyên [${_id}] đã tồn tại!` });
        return;
      }

      if (operations) {
        operations = operations.map((operation) =>
          StringUtil.toStringID(operation)
        );
      }

      const resource = new Resource({
        name,
        operations,
        description,
        priority,
        difficulty,
      });
      await resource.save();

      res.status(201).json({
        msg: `Tạo tài nguyên [${_id}] thành công!`,
        resource,
      });
    } catch (error) {
      next({ status: 500, msg: error.message });
    }
  }
}

module.exports = new ResourceController();
