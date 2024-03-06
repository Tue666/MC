const { Operation, OPERATION_STATUS } = require("../models/operation.model");
const StringUtil = require("../../utils/string.util");
const ValidateUtil = require("../../utils/validate.util");

class OperationController {
  buildStatusValue(value) {
    const status = value.toUpperCase();

    const okIncludeOne = ValidateUtil.ensureIncludeOne(
      status,
      Object.values(OPERATION_STATUS)
    );
    if (!okIncludeOne) {
      throw Error(
        `Trạng thái [${status}] không tồn tại. Hãy thử lại với: ${Object.values(
          OPERATION_STATUS
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

      const operation = await Operation.findByIdAndUpdate(
        _id,
        {
          $set: this.buildUpdate(rest),
        },
        {
          new: true,
        }
      );
      if (!operation) {
        next({
          status: 200,
          msg: `Cập nhật hành động [${_id}] không thành công. Kiểm tra lại [${_id}]!`,
        });
        return;
      }

      res.status(200).json({
        msg: `Cập nhật hành động [${_id}] thành công!`,
        operation,
      });
    } catch (error) {
      next({ status: 500, msg: error.message });
    }
  }

  async create(req, res, next) {
    try {
      let { name, ...rest } = req.body;

      const okRequiredFields = ValidateUtil.ensureRequiredFields(name);
      if (!okRequiredFields) {
        next({ status: 200, msg: "Các giá trị bắt buộc không được bỏ trống!" });
        return;
      }

      const _id = StringUtil.toStringID(name);
      const operationExisted = await Operation.findOne({ _id });
      if (operationExisted) {
        next({ status: 200, msg: `Hành động [${_id}] đã tồn tại!` });
        return;
      }

      const operation = new Operation({
        name,
        ...rest,
      });
      await operation.save();

      res.status(201).json({
        msg: `Tạo hành động [${_id}] thành công!`,
        operation,
      });
    } catch (error) {
      next({ status: 500, msg: error.message });
    }
  }
}

module.exports = {
  OperationController: new OperationController(),
};
