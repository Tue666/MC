const { QuestionRepository } = require("../repositories/question.repository");
const { ResourceService } = require("../services/resource.service");

class QuestionService {
  buildResources(resources) {
    if (!resources) return [];

    return resources.map((resource) => ResourceService.buildId(resource));
  }

  async findByRandom(body) {
    const { size, resources } = body;

    const filters = {};

    if (resources) {
      filters["resources"] = { $in: this.buildResources(resources) };
    }

    const questions = await QuestionRepository.findByRandom(
      size ? parseInt(size) : 1,
      filters
    );

    return questions;
  }

  async create(body) {
    const operation = await QuestionRepository.create(body);

    return operation;
  }
}

module.exports = {
  QuestionService: new QuestionService(),
};
