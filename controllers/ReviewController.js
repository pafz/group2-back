const Review = require('../models/Review');
const User = require('../models/User');
const Event = require('../models/Event');

const ReviewController = {
  async getById(req, res) {
    try {
      const review = await Review.findById(req.params._id);

      if (!review) {
        return res.status(400).send({ message: "This review doesn't exist" });
      }

      res.send(review);
    } catch (error) {
      console.error(error);
    }
  },

  async create(req, res, next) {
    try {
      const userConnected = await User.findById(req.user._id);
      req.body.userId = userConnected._id;

      const review = await Review.create(req.body);
      await Post.findByIdAndUpdate(req.body.postId, {
        $push: { reviewIds: review._id },
      });
      res.status(201).send({ msg: 'Review created correctly', review });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async update(req, res) {
    try {
      const review = await Review.findByIdAndUpdate(
        req.params._id,
        { ...req.body, image: req.file.filename },
        { new: true }
      );

      res.send({ message: 'Review successfully updated', review });
    } catch (error) {
      console.error(error);
    }
  },

  async like(req, res) {
    try {
      const review = await Review.findById(req.params._id);
      const alreadyLiked = review.likes.includes(req.user._id);
      if (alreadyLiked) {
        return res
          .status(400)
          .send({ message: 'You have already liked this review' });
      } else {
        const review = await Review.findByIdAndUpdate(
          req.params._id,

          { $push: { likes: req.user._id } },

          { new: true }
        );

        res.send(review);
      }
    } catch (error) {
      console.error(error);

      res.status(500).send({ message: 'There was a problem with your like' });
    }
  },

  async dislike(req, res) {
    try {
      const findReview = await Review.findById(req.params._id);
      const alreadyLiked = findReview.likes.includes(req.user._id);

      if (alreadyLiked === false) {
        return res
          .status(400)
          .send({ message: 'You have already disliked this review' });
      }

      await Review.updateOne(
        findReview,
        { $pull: { likes: req.user._id } },
        { new: true }
      );

      res.send(findReview);
    } catch (error) {
      console.error(error);

      res.status(500).send({ message: 'There was a problem with your like' });
    }
  },

  async delete(req, res) {
    try {
      const review = await Review.findByIdAndDelete(req.params._id);

      res.send({ message: 'Review deleted', review });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: 'There was a problem trying to remove the review' });
    }
  },
};

module.exports = ReviewController;
