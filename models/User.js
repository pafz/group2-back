const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({});

const User = mongoose.model('User', UserSchema);

module.exports = User;
