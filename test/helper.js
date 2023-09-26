const bcrypt = require('bcryptjs');
const Review = require('../models/Review');
const User = require('../models/User');

const addUser = async (email, passowrd, confirmed = true) => {
  const hashedPassword = bcrypt.hashSync(passowrd, 10);
  return User.create({
    email: email,
    password: hashedPassword,
    confirmed,
    acceptPolicity: true,
    occupation: 'Estudiante',
    ecosystem: '1',
    name: 'Testerodu',
    surname: 'The Tester',
    tel: '+34 00000001',
    bday: 0,
  });
};

const deleteAllusers = async () => User.deleteMany({});

module.exports = { addUser, deleteAllusers };
