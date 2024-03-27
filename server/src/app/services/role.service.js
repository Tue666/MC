const { ROLE_STATUS } = require("../models/role.model");
const { RoleRepository } = require("../repositories/role.repository");
const { OperationService } = require("./operation.service");
const { ResourceService } = require("./resource.service");
const { APIError } = require("../../handlers/error.handler");
const StringUtil = require("../../utils/string.util");

class RoleService {
  buildId(name) {
    return StringUtil.toStringID(name);
  }

  buildIds(names) {
    if (!names) return [];

    return names.map((name) => this.buildId(name));
  }

  buildPermissions(permissions) {
    if (!permissions) return [];

    return permissions
      .map((permission) => {
        let { resource, operations = [] } = permission;
        if (!resource) return;

        resource = ResourceService.buildId(resource);
        operations = operations.map((operation) =>
          OperationService.buildId(operation)
        );

        return { resource, operations };
      })
      .filter(Boolean);
  }

  buildStatusValue(value) {
    const status = value.toUpperCase();
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

  async verifyDuplicated(name) {
    const _id = this.buildId(name);
    const role = await RoleRepository.findOne({
      filters: { _id },
      select: { _id: 1 },
    });

    if (role) throw new APIError(200, `Vai trò [${_id}] đã tồn tại!`);
  }

  async findByIds(body) {
    const { _ids } = body;

    const queries = {
      _id: { $in: this.buildIds(_ids) },
      status: { $nin: [ROLE_STATUS.locked] },
    };

    const roles = await RoleRepository.findByIds(queries);

    return roles;
  }

  async create(body) {
    const { name, permissions, ...rest } = body;

    await this.verifyDuplicated(name);

    const role = await RoleRepository.create({
      name,
      permissions: this.buildPermissions(permissions),
      ...rest,
    });

    return role;
  }

  async update(body) {
    const { _id, ...rest } = body;

    const options = {
      new: true,
      runValidators: true,
    };

    const role = await RoleRepository.findByIdAndUpdate({
      _id: this.buildId(_id),
      update: this.buildUpdate(rest),
      options,
    });

    return role;
  }
}

module.exports = {
  RoleService: new RoleService(),
};
