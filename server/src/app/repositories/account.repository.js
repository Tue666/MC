const { Account, Student } = require("../models/account.model");

class AccountRepository {
  async findOne(options) {
    const query = Account.findOne(options.filters);

    if (options.select) {
      query.select(options.select);
    }

    if (options.populate) {
      query.populate(options.populate);
    }

    return query;
  }

  async createStudent(accountInf) {
    const account = new Student(accountInf);
    await account.save();

    return account;
  }

  async findByIdAndUpdate(options) {
    const account = await Account.findByIdAndUpdate(
      options._id,
      options.update,
      options.options
    );

    return account;
  }
}

module.exports = {
  AccountRepository: new AccountRepository(),
};
