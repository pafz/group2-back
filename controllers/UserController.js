const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer');
const API_URL = 'http://localhost:3000';
//TODO: hash email, like password

const UserController = {
  //   async userConfirm(req, res) {
  //     try {
  //       const token = req.query.emailToken;
  //       const payload = jwt.verify(token, process.env.JWT_SECRET);
  //       await User.findOneAndUpdate(
  //         { email: payload.email },
  //         { confirmed: true },
  //         { new: true }
  //       );
  //       res.status(200).send('Su correo ha sido validado, ya puede hacer login!');
  //     } catch (error) {
  //       console.error(error);
  //       res
  //         .status(500)
  //         .json({ message: 'Hubo un error al confirmar al usuario' });
  //     }
  //   },

  async registerUser(req, res, next) {
    const {
      name,
      surname,
      surname2,
      email,
      password,
      password2,
      occupation,
      role,
      avatar,
    } = req.body;
    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

    // //FIXME: works??
    // const validateEmail = email => {
    //   return emailRegex.test(email);
    // };
    // console.log(validateEmail()); // true

    // if (email !== false) {
    //   return res.status(400).json({
    //     message: 'No válido. Por favor, proporciona un correo de válido',
    //   });
    // }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'El usuario ya existe' });
      }

      if (password !== password2) {
        return res
          .status(409)
          .json({ message: 'Las passwords no son iguales' });
      }

      const hashedPassword = await bcrypt.hashSync(password, 10);
      const emailToken = jwt.sign({ email: email }, process.env.JWT_SECRET, {
        expiresIn: '48h',
      });
      const url = `http://localhost:3000/users/confirm` + emailToken;
      await transporter.sendMail({
        to: req.body.email,
        subject: 'Confirm Your Registration',
        html: `<h3>Welcome, you're one step away from registering</h3>
          <a href="${url}">Click to confirm your registration</a>`,
      });

      const user = await User.create({
        name,
        surname,
        surname2,
        email,
        password: hashedPassword,
        password2: hashedPassword,
        occupation,
        role,
        tokens: [{ token: emailToken.toString() }],
        avatar: 'student',
      });

      await transporter.sendMail({
        to: email,
        subject: 'Registro realizado con éxito',
        html: `<h3>Finaliza el registro a través de tu correo en el siguiente enlace:</h3>
                  <a href="${url}?emailToken=${emailToken}">Click para confirmar tu registro</a>`,
      });
      res.status(201).json({
        message: 'Usuario registrado  exitosamente!',
        user,
        token: emailToken,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  //TODO: check of it works
  async recoverPassword(req, res) {
    try {
      const recoverToken = jwt.sign(
        { email: req.params.email },
        process.env.JWT_SECRET,
        {
          expiresIn: '48h',
        }
      );
      const url = API_URL + '/users/resetPassword/' + recoverToken;
      await transporter.sendMail({
        to: req.params.email,
        subject: 'Recover Password',
        html: `<h3>Recover Password</h3>
          <a href="${url}">Recover Password</a>
          The link will expire in 48 hours
        `,
      });
      res.send({
        message: 'A recovery email has been sent to your email address',
      });
    } catch (error) {
      console.error(error);
    }
  },

  //TODO: check of it works
  async resetPassword(req, res) {
    try {
      const recoverToken = req.params.recoverToken;
      const payload = jwt.verify(recoverToken, process.env.JWT_SECRET);
      await User.findOneAndUpdate(
        { email: payload.email },
        { password: req.body.password }
      );
      res.send({ message: 'Password changed successfully' });
    } catch (error) {
      console.error(error);
    }
  },

  async loginUser(req, res, next) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'Credenciales no válidas' });
      }

      //   if (!user.confirmed) {
      //     return res.status(400).send({ message: 'Debes confirmar tu email' });
      //   }

      const isMatch = bcrypt.compareSync(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciales no válidas' });
      }

      //FIXME: change expiresIn h, depends on the event? avoid to logout during an event
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '48h',
      });
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();

      res.status(200).json({ message: 'Bienvenidx ' + user.name, token });
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error durante el login' });
      next(error);
    }
  },

  //FIXME: check if it works
  async logoutUser(req, res) {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { tokens: req.headers.authorization },
      });
      res.send({ message: 'Loggout con éxito' });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'Hubo un problema al desloguear',
      });
    }
  },
};
module.exports = UserController;
