const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new mongoose.Schema({});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
