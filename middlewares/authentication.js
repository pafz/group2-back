const User = require('../models/User');
const Event = require('../models/Event');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const payload = jwt.verify(token, jwt_secret);

    const user = await User.findOne({ _id: payload._id, tokens: token });

    if (!user) {
      return res.status(401).send({ message: 'You are not allowed' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .send({ error, message: 'There was a problem with the token' });
  }
};

const isAuthor = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params._id);

    if (!event) {
      return res.status(404).send({ message: 'Post not found' });
    }

    if (event.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send({ message: 'You cannot edit elements that are not yours' });
    }

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).send({
      error,
      message: 'There was a problem with the author check',
    });
  }
};

const isAdmin = async (req, res, next) => {
  const admins = ['admin', 'superadmin'];

  if (!admins.includes(req.user.role)) {
    return res.status(403).send({
      message: 'You do not have permission',
    });
  }

  next();
};

module.exports = { authentication, isAdmin, isAuthor };
