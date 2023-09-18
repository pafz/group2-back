const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

//TODO: required some fields -> basic nombre, apellido, correo, empresa/ estudiante

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Por favor rellena tu nombre'],
    },
    surname: {
      type: String,
      required: [true, 'Por favor rellena tu primer apellido'],
    },
    surname2: {
      type: String,
    },
    email: { type: String, required: [true, 'Por favor rellena tu email'] },
    password: {
      type: String,
      required: [true, 'Por favor rellena tu contraseña'],
    },
    //FIXME: delete after test - email confirmed
    // confirmed: {
    //   type: Boolean,
    //   default: false,
    // },
    password2: {
      type: String,
      required: [true, 'Por favor reescribe tu contraseña'],
    },
    eventIds: [{ type: ObjectId, ref: 'Event' }],
    reviewIds: [{ type: ObjectId, ref: 'Review' }],
    followers: [{ type: ObjectId, ref: 'User' }],
    occupation: {
      type: String,
      required: [true, 'Por favor rellena tu ocupación'],
    },
    role: String,
    tokens: [],
    avatar: String,
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
