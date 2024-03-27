const { QuestionService } = require("../services/question.service");

class QuestionController {
  async findByRandom(req, res, next) {
    try {
      const questions = await QuestionService.findByRandom(req.body);

      res.status(200).json({
        questions,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const question = await QuestionService.create(req.body);

      res.status(201).json({
        msg: `Tạo câu hỏi thành công!`,
        question,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  QuestionController: new QuestionController(),
};
