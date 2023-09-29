const mongoose = require('mongoose');
const { isValidPassword } = require('mongoose-custom-validators');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const levels = ['1', '2'];

const occupations = [
  'Empleado de EDEM',
  'Estudiante de EDEM',
  'Empleado de LANZADERA',
  'Inversor Angels',
  'Propietario/a o dirección general',
  'Director/a de departamento',
  'Profesional senior',
  'Profesional junior',
  'Desempleado/a',
  'Estudiante',
];

const interest = [
  'crecimiento',
  'inversión',
  'comunicación',
  'marketing',
  'tecnología',
  'producción',
  'habilidades',
  'liderazgo',
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
      match: [/.+\@.+\..+/, 'Por favor inserta un email válido'],
      required: [true, 'Por favor rellena tu email'],
    },
    bday: {
      type: Date,
      required: [true, 'Por favor rellena tu fecha de nacimiento'],
    },
    tel: {
      type: String,
      required: [true, 'Por favor rellena tu teléfono'],
    },
    ecosystem: {
      type: String,
      enum: levels,
      required: [true, 'Por favor selecciona una opción'],
    },
    occupation: {
      type: String,
      enum: occupations,
      required: [true, 'Por favor selecciona una opción Yes'],
    },
    password: {
      type: String,
      validate: {
        validator: isValidPassword,
        message: 'mín: 8caracteres 1mayús 1minús 1número 1carácter especial',
      },
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
    interested: { type: [String], enum: interest },
    tokens: [],

    eventIds: [{ type: ObjectId, ref: 'Event' }],
    reviewIds: [{ type: ObjectId, ref: 'Review' }],
    followers: [{ type: ObjectId, ref: 'User' }],
    orderIds: [{ type: ObjectId, ref: 'Order' }],
    wishList: [{ type: ObjectId, ref: 'Event' }],
  },
  { timestamps: true }
);

UserSchema.virtual('avatar_url').get(function () {
  if (this.avatar) {
    return `/assets/images/user/${this.avatar}`;
  }
  return '/assets/images/user/avatar-default.png';
});

UserSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.tokens;
  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.role;
  delete user.acceptPolicity;
  delete user._v;

  user.avatar_url = this.avatar_url;
  return user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
