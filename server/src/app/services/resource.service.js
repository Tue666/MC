const { ResourceRepository } = require("../repositories/resource.repository");
const { OperationService } = require("./operation.service");
const { APIError } = require("../../handlers/error.handler");
const StringUtil = require("../../utils/string.util");

class ResourceService {
  buildId(name) {
    return StringUtil.toStringID(name);
  }

  buildOperations(operations) {
    if (!operations) return [];

    return operations.map((operation) => OperationService.buildId(operation));
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
    const resource = await ResourceRepository.findOne({
      filters: { _id },
      select: { _id: 1 },
    });

    if (resource) throw new APIError(200, `Tài nguyên [${_id}] đã tồn tại!`);
  }

  async create(body) {
    const { name, operations, ...rest } = body;

    await this.verifyDuplicated(name);

    const resource = await ResourceRepository.create({
      name,
      operations: this.buildOperations(operations),
      ...rest,
    });

    return resource;
  }

  async update(body) {
    const { _id, ...rest } = body;

    const options = {
      new: true,
      runValidators: true,
    };

    const resource = await ResourceRepository.findByIdAndUpdate({
      _id: this.buildId(_id),
      update: this.buildUpdate(rest),
      options,
    });

    return resource;
  }
}

module.exports = {
  ResourceService: new ResourceService(),
};
