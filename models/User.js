const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;
// const Joi = require('joi');

const validEcosystemYes = [
  'Empleado de EDEM',
  'Estudiante',
  'Empleado Lanzadera',
  'Inversor de Angels',
];

const validEcosystemNo = [
  'Propietari@ / dirección general',
  'Director/a de departamento',
  'Profesional senior',
  'Profesional junior',
  'Desemplead@',
  'Estudiante',
];

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      match: [
        /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
        'Por favor rellena un nombre válido',
      ],
      required: [true, 'Por favor rellena tu nombre'],
    },
    surname: {
      type: String,
      match: [
        /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
        'Por favor apellido/s válido/s',
      ],
      required: [true, 'Por favor rellena tu/s apellido/s'],
    },
    email: {
      type: String,
      match: [
        /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
        'Por favor inserta un email válido',
      ],
      required: [true, 'Por favor rellena tu email'],
    },
    //TODO: BSON Date data type mongo DB & https://stackoverflow.com/questions/22041785/find-whether-someone-got-a-birthday-in-the-next-30-days-with-mongo
    bday: {
      type: Date,
      match: [/.+\@.+\..+/, 'Por favor inserta una fecha válida'],
      required: [true, 'Por favor rellena tu fecha de nacimiento'],
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
    //FIXME: depends on the previous option, are required!!
    ecosystemYes: {
      type: String,
      required: [true, 'Situación actual es requerida'],
      enum: validEcosystemYes,
    },
    ecosystemNo: {
      type: String,
      required: [true, 'Situación actual es requerida'],
      enum: validEcosystemNo,
    },
    occupation: {
      type: String,
      required: [true, 'Por favor selecciona tu ocupación'],
    },
    password: {
      type: String,
      //FIXME: do match works properly
      // match: [
      //   /"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$"/,
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
    confirmed: {
      type: Boolean,
      default: false,
    },
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
