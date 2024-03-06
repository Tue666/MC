const { Resource, RESOURCE_STATUS } = require("../models/resource.model");
const StringUtil = require("../../utils/string.util");
const ValidateUtil = require("../../utils/validate.util");

class ResourceController {
  buildStatusValue(value) {
    const status = value.toUpperCase();

    const okIncludeOne = ValidateUtil.ensureIncludeOne(
      status,
      Object.values(RESOURCE_STATUS)
    );
    if (!okIncludeOne) {
      throw Error(
        `Trạng thái [${status}] không tồn tại. Hãy thử lại với: ${Object.values(
          RESOURCE_STATUS
        ).join(", ")}.`
      );
    }

    return status;
  }

  buildValue(value) {
    return value;
  }

  valueUpdater(field, value) {
    const updater = {
      status: this.buildStatusValue,
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

  async partialUpdate(req, res, next) {
    try {
      let { _id, ...rest } = req.body;

      const okRequiredFields = ValidateUtil.ensureRequiredFields(_id);
      if (!okRequiredFields) {
        next({ status: 200, msg: "Các giá trị bắt buộc không được bỏ trống!" });
        return;
      }

      _id = StringUtil.toStringID(_id);

      const resource = await Resource.findByIdAndUpdate(
        _id,
        {
          $set: this.buildUpdate(rest),
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

  async create(req, res, next) {
    try {
      let { name, operations, ...rest } = req.body;

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
        ...rest,
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

module.exports = {
  ResourceController: new ResourceController(),
};
