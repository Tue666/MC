const { OPERATION_STATUS } = require("../models/operation.model");
const { RESOURCE_STATUS } = require("../models/resource.model");
const { Role, ROLE_STATUS } = require("../models/role.model");
const StringUtil = require("../../utils/string.util");
const ValidateUtil = require("../../utils/validate.util");

class RoleController {
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
        Object.values(ROLE_STATUS)
      );
      if (!okIncludeOne) {
        next({
          status: 200,
          msg: `Trạng thái [${status}] không tồn tại. Hãy thử lại với: ${Object.values(
            ROLE_STATUS
          ).join(", ")}.`,
        });
        return;
      }

      const role = await Role.findByIdAndUpdate(
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
      if (!role) {
        next({
          status: 200,
          msg: `Cập nhật vai trò [${_id}] không thành công. Kiểm tra lại [${_id}]!`,
        });
        return;
      }

      res.status(200).json({
        msg: `Cập nhật vai trò [${_id}] thành công!`,
        role,
      });
    } catch (error) {
      next({ status: 500, msg: error.message });
    }
  }

  async findByIds(req, res, next) {
    try {
      let { _ids } = req.body;

      const okRequiredFields = ValidateUtil.ensureRequiredFields(_ids);
      if (!okRequiredFields) {
        next({ status: 200, msg: "Các giá trị bắt buộc không được bỏ trống!" });
        return;
      }

      _ids = _ids.map((_id) => StringUtil.toStringID(_id));
      const queries = {
        _id: { $in: _ids },
        status: { $nin: [ROLE_STATUS.locked] },
      };
      const roles = await Role.aggregate([
        { $match: queries },
        { $unwind: "$permissions" },
        // Get resource
        {
          $lookup: {
            from: "resources",
            let: { permissions: "$permissions" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$_id", "$$permissions.resource"] },
                      { $not: { $in: ["$status", [RESOURCE_STATUS.locked]] } },
                    ],
                  },
                },
              },
              {
                $project: { operations: 0 },
              },
            ],
            as: "resource",
          },
        },
        { $addFields: { resource: { $arrayElemAt: ["$resource", 0] } } },
        // Get operations
        {
          $lookup: {
            from: "operations",
            let: { permissions: "$permissions" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $in: ["$_id", "$$permissions.operations"] },
                      { $not: { $in: ["$status", [OPERATION_STATUS.locked]] } },
                    ],
                  },
                },
              },
            ],
            as: "operations",
          },
        },
        { $sort: { "resource.priority": 1 } },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            description: { $first: "$description" },
            permissions: {
              $push: {
                $cond: {
                  if: { $ifNull: ["$resource", false] },
                  then: {
                    resource: "$resource",
                    operations: "$operations",
                  },
                  else: "$$REMOVE",
                },
              },
            },
            status: { $first: "$status" },
            created_at: { $first: "$created_at" },
            updated_at: { $first: "$updated_at" },
          },
        },
      ]);

      res.status(200).json({
        roles,
      });
    } catch (error) {
      next({ status: 500, msg: error.message });
    }
  }

  async insert(req, res, next) {
    try {
      let { name, permissions, description } = req.body;

      const okRequiredFields = ValidateUtil.ensureRequiredFields(name);
      if (!okRequiredFields) {
        next({ status: 200, msg: "Các giá trị bắt buộc không được bỏ trống!" });
        return;
      }

      const _id = StringUtil.toStringID(name);
      const roleExisted = await Role.findOne({ _id });
      if (roleExisted) {
        next({ status: 200, msg: `Vai trò [${_id}] đã tồn tại!` });
        return;
      }

      if (permissions) {
        permissions = permissions.map((permission) => {
          let { resource, operations = [] } = permission;
          if (!resource) {
            next({ status: 200, msg: "Thông tin ủy quyền không chính xác!" });
            return;
          }

          resource = StringUtil.toStringID(resource);
          operations = operations.map((operation) =>
            StringUtil.toStringID(operation)
          );

          return { resource, operations };
        });
      }

      const role = new Role({
        name,
        permissions,
        description,
      });
      await role.save();

      res.status(201).json({
        msg: `Tạo vai trò [${_id}] thành công!`,
        role,
      });
    } catch (error) {
      next({ status: 500, msg: error.message });
    }
  }
}

module.exports = new RoleController();
