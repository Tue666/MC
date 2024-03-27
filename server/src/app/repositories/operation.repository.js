const { Operation } = require("../models/operation.model");

class OperationRepository {
  async findOne(options) {
    const query = Operation.findOne(options.filters);

    if (options.select) {
      query.select(options.select);
    }

    return query;
  }

  async create(operationInf) {
    const operation = new Operation(operationInf);
    await operation.save();

    return operation;
  }

  async findByIdAndUpdate(options) {
    const operation = await Operation.findByIdAndUpdate(
      options._id,
      options.update,
      options.options
    );

    return operation;
  }
}

module.exports = {
  OperationRepository: new OperationRepository(),
};
