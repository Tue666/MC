const { OPERATION_STATUS } = require("../models/operation.model");
const { OperationRepository } = require("../repositories/operation.repository");
const { APIError } = require("../../handlers/error.handler");
const StringUtil = require("../../utils/string.util");
const ValidateUtil = require("../../utils/validate.util");

class OperationService {
  buildId(name) {
    return StringUtil.toStringID(name);
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
    const operation = await OperationRepository.findOne({
      filters: { _id },
      select: { _id: 1 },
    });

    if (operation) throw new APIError(200, `Hành động [${_id}] đã tồn tại!`);
  }

  async create(body) {
    const { name, ...rest } = body;

    await this.verifyDuplicated(name);

    const operation = await OperationRepository.create({
      name,
      ...rest,
    });

    return operation;
  }

  async update(body) {
    const { _id, ...rest } = body;

    const options = {
      new: true,
      runValidators: true,
    };

    const operation = await OperationRepository.findByIdAndUpdate({
      _id: this.buildId(_id),
      update: this.buildUpdate(rest),
      options,
    });

    return operation;
  }
}

module.exports = {
  OperationService: new OperationService(),
};
