const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;
//TODO: required some fields -> basic nombre, apellido, correo, empresa/ estudiante
// const Joi = require('joi');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Por favor rellena tu nombre'],
    },
    surname: {
      type: String,
      required: [true, 'Por favor rellena tu/s apellido/s'],
    },
    email: {
      type: String,
      match: [/.+\@.+\..+/, 'Por favor inserta un email válido'],
      required: [true, 'Por favor rellena tu email'],
    },
    //TODO: BSON Date data type mongo DB & https://stackoverflow.com/questions/22041785/find-whether-someone-got-a-birthday-in-the-next-30-days-with-mongo
    bday: {
      type: Date,
      match: [/.+\@.+\..+/, 'Por favor inserta uno válido'],
      required: [true, 'Por favor rellena tu edad'],
    },
    tel: {
      type: String,
      //FIXME: do match works properly
      // match: [
      //   /^\+?(6\d{2}|7[1-9]\d{1})\d{6}$/,
      //   'Por favor insetar un teléfono español',
      // ],
      required: [true, 'Por favor rellena tu teléfono'],
    },
    ecosystem: {
      type: String,
      required: [true, 'Por favor selecciona una opción'],
    },
    occupation: {
      type: String,
      required: [true, 'Por favor rellena tu ocupación'],
    },
    password: {
      type: String,
      //FIXME: do match works properly
      // match: [
      //   /"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,30}$"/,
      //   'mín: 10caracteres 1mayús 1minús 1número 1carácter especial,',
      // ],
      required: [true, 'Por favor rellena tu contraseña'],
    },
    role: {
      type: String,
      confirmed: Boolean,
      tokens: [],
    },
    acceptPolicity: {
      type: Boolean,
      required: [true, 'Por favor acepta la política'],
    },
    acceptCommunication: {
      type: Boolean,
    },
    //FIXME: delete after test - email confirmed
    // confirmed: {
    //   type: Boolean,
    //   default: false,
    // },
    avatar: String,
    role: String,
    tokens: [],

    eventIds: [{ type: ObjectId, ref: 'Event' }],
    reviewIds: [{ type: ObjectId, ref: 'Review' }],
    followers: [{ type: ObjectId, ref: 'User' }],
    orderIds: [{ type: ObjectId, ref: 'Order' }],
    wishList: [{ type: ObjectId, ref: 'Event' }],
  },
  { timestamps: true }
);

// Agregar una propiedad virtual para la URL del avatar
UserSchema.virtual('avatar_url').get(function () {
  if (this.avatar) {
    return `/assets/images/user/${this.avatar}`;
  }
  // Si no hay avatar, puedes proporcionar una URL predeterminada o manejarlo de la manera que prefieras
  return '/assets/images/user/avatar-default.png'; // Cambia la ruta según tu estructura de carpetas
});

UserSchema.methods.toJSON = function () {
  console.log(this.avatar_url);
  //const user = this.toObject();
  const user = this._doc;
  delete user.tokens;
  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;
  //FIXME: delete user.confirmed;
  delete user.role;
  delete user.acceptPolicity;
  delete user._v;

  // Agregar la URL del avatar
  user.avatar_url = this.avatar_url;
  return user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
