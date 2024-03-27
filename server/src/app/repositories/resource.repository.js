const { Resource } = require("../models/resource.model");

class ResourceRepository {
  async findOne(options) {
    const query = Resource.findOne(options.filters);

    if (options.select) {
      query.select(options.select);
    }

    return query;
  }

  async create(resourceInf) {
    const resource = new Resource(resourceInf);
    await resource.save();

    return resource;
  }

  async findByIdAndUpdate(options) {
    const resource = await Resource.findByIdAndUpdate(
      options._id,
      options.update,
      options.options
    );

    return resource;
  }
}

module.exports = {
  ResourceRepository: new ResourceRepository(),
};
