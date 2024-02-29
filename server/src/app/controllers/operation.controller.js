const { Operation, OPERATION_STATUS } = require("../models/operation.model");
const StringUtil = require("../../utils/string.util");
const ValidateUtil = require("../../utils/validate.util");

class OperationController {
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
        Object.values(OPERATION_STATUS)
      );
      if (!okIncludeOne) {
        next({
          status: 200,
          msg: `Trạng thái [${status}] không tồn tại. Hãy thử lại với: ${Object.values(
            OPERATION_STATUS
          ).join(", ")}.`,
        });
        return;
      }

      const operation = await Operation.findByIdAndUpdate(
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

  async insert(req, res, next) {
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

module.exports = new OperationController();
