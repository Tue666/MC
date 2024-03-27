const { OPERATION_STATUS } = require("../models/operation.model");
const { RESOURCE_STATUS } = require("../models/resource.model");
const { Role } = require("../models/role.model");

class RoleRepository {
  async findOne(options) {
    const query = Role.findOne(options.filters);

    if (options.select) {
      query.select(options.select);
    }

    return query;
  }

  async findByIds(queries) {
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

    return roles;
  }

  async create(roleInf) {
    const role = new Role(roleInf);
    await role.save();

    return role;
  }

  async findByIdAndUpdate(options) {
    const role = await Role.findByIdAndUpdate(
      options._id,
      options.update,
      options.options
    );

    return role;
  }
}

module.exports = {
  RoleRepository: new RoleRepository(),
};
