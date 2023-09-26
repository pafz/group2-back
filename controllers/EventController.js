const Event = require('../models/Event');
const User = require('../models/User');

const EventController = {
  async getAll(req, res) {
    try {
      const events = await Event.find()
        .populate('userId')
        .populate('reviewIds');

      res.send(events);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'There was a problem' });
    }
  },

  async getById(req, res) {
    try {
      const event = await Event.findById(req.params._id).populate('reviewIds');

      if (!event) {
        return res.status(400).send({ message: "This event doesn't exist" });
      }

      res.send(event);
    } catch (error) {
      console.error(error);
    }
  },

  async getEventsByName(req, res) {
    try {
      if (req.params.title.length > 20) {
        return res.status(400).send('To long search');
      }

      const title = new RegExp(req.params.title, 'i');

      const events = await Event.find({ title });

      if (!events) {
        return res.status(400).send({ message: "This event doesn't exist" });
      }

      res.send(events);
    } catch (error) {
      console.error(error);

      res.status(500).send({ message: 'There was a problem' });
    }
  },

  async searchEvents(req, res) {
    try {
      if (req.query.title.length > 20) {
        return res.status(400).send('To long search');
      }

      const title = new RegExp(req.query.title || '.*', 'i');
      const query = { title };
      if (req.query.categories) {
        query.category = { $in: req.query.categories.split(',') };
      }

      const events = await Event.find(query);

      if (!events) {
        return res.status(400).send({ message: "This event doesn't exist" });
      }

      res.send(events);
    } catch (error) {
      console.error(error);

      res.status(500).send({ message: 'There was a problem' });
    }
  },

  async getEventUserReview(req, res) {
    try {
      let x = req.someValue;
      if (typeof x === 'string') {
        x = x.replace(/[{()}]/g, '');
      }

      const { page = 1, limit = 10 } = req.query;
      const event = await Event.find()
        .populate('userId', 'name')
        .populate('reviewIds', 'title body')
        .limit(parseInt(limit))
        .skip((page - 1) * limit)
        .exec();

      res.send(event);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async create(req, res, next) {
    try {
      const event = await Event.create({
        ...req.body,
        userId: req.user._id,
        image: req.file?.filename,
      });

      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { eventIds: event._id } },
        { new: true }
      );
      res.status(201).send({ msg: 'Event created correctly', event });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async update(req, res) {
    try {
      const event = await Event.findByIdAndUpdate(
        req.params._id,
        { ...req.body, image: req.file?.filename },
        { new: true }
      );

      res.send({ message: 'Event successfully updated', event });
    } catch (error) {
      console.error(error);
    }
  },

  async like(req, res) {
    try {
      const event = await Event.findById(req.params._id);
      const alreadyLiked = event.likes?.includes(req.user._id);
      if (alreadyLiked) {
        return res
          .status(400)
          .send({ message: 'You have already liked this event' });
      } else {
        const event = await Event.findByIdAndUpdate(
          req.params._id,

          { $push: { likes: req.user._id } },

          { new: true }
        );
        await User.findByIdAndUpdate(
          req.user._id,
          { $push: { wishList: req.params._id } },
          { new: true }
        );

        res.send(event);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'There was a problem with your like' });
    }
  },

  async dislike(req, res) {
    try {
      const findEvent = await Event.findById(req.params._id);
      const alreadyLiked = findEvent.likes.includes(req.user._id);

      if (alreadyLiked === false) {
        return res
          .status(400)
          .send({ message: 'You have already disliked this event' });
      }

      const event = await Event.findByIdAndUpdate(
        findEvent._id,
        { $pull: { likes: req.user._id } },
        { new: true }
      );

      res.send(event);
    } catch (error) {
      console.error(error);

      res.status(500).send({ message: 'There was a problem with your like' });
    }
  },

  async delete(req, res) {
    try {
      const event = await Event.findByIdAndDelete(req.params._id);
      res.send({ message: 'Event deleted', event });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: 'There was a problem trying to remove the event' });
    }
  },
};

module.exports = EventController;
