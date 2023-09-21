const Question = require('../models/Question');
const User = require('../models/User');

const QuestionController = {
  async getAll(req, res) {
    try {
      const questions = await Question.find().populate('userId');
      res.send(questions);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'There was a problem' });
    }
  },

  async create(req, res, next) {
    try {
      const question = await Question.create({
        ...req.body,
        userId: req.user._id,
      });
      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { questionIds: question._id } },
        { new: true }
      );
      res.status(201).send({ msg: 'Question created correctly', question });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async update(req, res) {
    try {
      const question = await Question.findByIdAndUpdate(
        req.params._id,
        { ...req.body },
        { new: true }
      );

      res.send({ message: 'Question successfully updated', question });
    } catch (error) {
      console.error(error);
    }
  },

  async delete(req, res) {
    try {
      const question = await Question.findByIdAndDelete(req.params._id);

      res.send({ message: 'Question deleted', question });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: 'There was a problem trying to remove the question' });
    }
  },
};

module.exports = QuestionController;
