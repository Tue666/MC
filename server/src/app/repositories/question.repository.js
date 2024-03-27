const { Question } = require("../models/question.model");

class QuestionRepository {
  async findByRandom(size, filters) {
    const questions = await Question.aggregate([
      { $match: filters },
      { $sample: { size } },
    ]);

    return questions;
  }

  async create(questionInf) {
    const question = new Question(questionInf);
    await question.save();

    return question;
  }
}

module.exports = {
  QuestionRepository: new QuestionRepository(),
};
