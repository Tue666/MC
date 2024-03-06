const { QUESTION_TYPES, Question } = require("../models/question.model");
const ValidateUtil = require("../../utils/validate.util");
const StringUtil = require("../../utils/string.util");

class QuestionController {
  async create(req, res, next) {
    try {
      let { content, type, values, answers, ...rest } = req.body;

      const okRequiredFields = ValidateUtil.ensureRequiredFields(
        content,
        type,
        values,
        answers
      );
      if (!okRequiredFields) {
        next({ status: 200, msg: "Các giá trị bắt buộc không được bỏ trống!" });
        return;
      }

      const okIncludeOne = ValidateUtil.ensureIncludeOne(
        type,
        Object.values(QUESTION_TYPES)
      );
      if (!okIncludeOne) {
        next({
          status: 200,
          msg: `Loại câu hỏi [${type}] không tồn tại. Hãy thử lại với: ${Object.values(
            QUESTION_TYPES
          ).join(", ")}.`,
        });
        return;
      }

      const question = new Question({
        content,
        type,
        values,
        answers,
        ...rest,
      });
      await question.save();

      res.status(201).json({
        msg: `Tạo câu hỏi thành công!`,
        question,
      });
    } catch (error) {
      next({ status: 500, msg: error.message });
    }
  }

  async findRandomQuestions(queryParams) {
    let { size, resources } = queryParams;

    size = size ? parseInt(size) : 1;

    const queries = {};

    if (resources !== null && resources !== undefined) {
      resources = StringUtil.toArray(resources);
      queries["resources"] = { $in: resources };
    }

    const questions = await Question.aggregate([
      { $match: queries },
      { $sample: { size } },
    ]);

    return questions;
  }
}

module.exports = {
  QuestionController: new QuestionController(),
};
