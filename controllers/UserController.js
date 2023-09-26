const User = require('../models/User');
const transporter = require('../config/nodemailer');
require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

const API_URL = 'http://localhost:3000';
//TODO: hash email, like password
//TODO: regex password, mail,
//TODO: recoverPassword, resetPassword
const UserController = {
  async userConfirm(req, res) {
    try {
      const token = req.params.emailToken;
      const user = await User.findOne({ 'tokens.token': token });
      const validToken = jwt.verify(token, jwt_secret);
      if (!user || !validToken) {
        return res
          .status(401)
          .json({ message: 'El token no es válido o ha expirado' });
      }

      const updatedUser = await User.findOneAndUpdate(
        { 'tokens.token': token },
        { confirmed: true, tokens: [] },
        { new: true }
      );

      res.status(200).send('Su correo ha sido validado, ya puede hacer login!');
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Hubo un error al confirmar al usuario' });
    }
  },

  async registerUser(req, res, next) {
    const {
      name,
      surname,
      email,
      bday,
      tel,
      ecosystem,
      occupation,
      password,
      role,
      acceptPolicity,
      acceptCommunication,
    } = req.body;

    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    const validateEmail = email => {
      return emailRegex.test(email);
    };

    if (validateEmail(email) === false) {
      return res.status(400).json({
        message: 'No válido. Por favor, proporciona un correo de válido',
      });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "El usuario ya existe" });
      }

      if (password !== password2) {
        return res
          .status(409)
          .json({ message: "Las passwords no son iguales" });
      }

      const emailToken = jwt.sign({ mail: req.body.email }, jwt_secret, {
        expiresIn: '48h',
      });
      const hashedPassword = await bcrypt.hashSync(password, 10);
      const user = await User.create({
        name,
        surname,
        email,
        bday,
        tel,
        ecosystem,
        occupation,
        password: hashedPassword,
        role,
        acceptPolicity,
        acceptCommunication,
        interested: [],
        tokens: [{ token: emailToken.toString() }],
        avatar: req.file?.filename,
      });

      const BASE_URL = 'http://localhost:3000'; // TODO: Usar la base url correcta (extraer a variable de entorno);
      const url = `${BASE_URL}/users/confirm/${emailToken}`;

      await transporter.sendMail({
        to: email,
        subject: 'MdE Confirmación de registro',
        html: `<h3>Bienvenido a Marina de Eventos</h3>
              <p>Para continuar por favor haz clic en este <a href="${url}">enlace</a></p>
              <p>Si no puedes ver el enlace correctamente copia y pegar esta url en el navegador:</p>
              ${url}`,
      });
      res.status(201).send({
        message: 'Usuario creado con exito, por favor comprueba tu email.',
        user,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async recoverPassword(req, res, next) {
    const { email } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res
          .status(201)
          .json({ message: 'Por favor compruebe su correo' });
      }

      const token = jwt.sign({ recover: email }, jwt_secret, {
        expiresIn: '48h',
      });

      await User.findOneAndUpdate({ email }, { tokens: [{ token }] });

      const BASE_URL = 'http://localhost:3000'; // TODO: Usar la base url correcta (extraer a variable de entorno);
      const url = `${BASE_URL}/passwordreset/${token}`;

      await transporter.sendMail({
        to: email,
        subject: 'MdE recuperación de contraseña',
        html: `<p>Para continuar por favor haz clic en este <a href="${url}">enlace</a></p>
              <p>Si no puedes ver el enlace correctamente copia y pegar esta url en el navegador:</p>
              ${url}`,
      });
      res.status(201).send({
        message: 'Por favor compruebe su correo',
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async resetPassword(req, res, next) {
    const { password, token } = req.body;
    try {
      const existingUser = await User.findOne({ 'tokens.token': token });
      const validToken = jwt.verify(token, jwt_secret);
      if (!existingUser || !validToken) {
        return res
          .status(401)
          .json({ message: 'El token no es válido o ha expirado' });
      }

      const hashedPassword = await bcrypt.hashSync(password, 10);
      await User.findOneAndUpdate(
        { 'tokens.token': token },
        { password: hashedPassword, tokens: [] }
      );
      res.status(200).send({
        message: 'Password actualizado con exito',
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async loginUser(req, res, next) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: "Credenciales no válidas" });
      }

      if (!user.confirmed) {
        return res.status(400).send({ message: 'Debes confirmar tu email' });
      }

      const isMatch = bcrypt.compareSync(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Credenciales no válidas" });
      }

      //FIXME: change expiresIn h, depends on the event? avoid to logout during an event
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "48h",
      });
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();

      res.status(200).json({ message: 'Bienvenidx ' + user.name, token, user }); //TODO: añadido user para guardar todo el user en front
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error durante el login" });
      next(error);
    }
  },

  async logoutUser(req, res) {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { tokens: req.headers.authorization },
      });
      res.send({ message: 'Logout con éxito' });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Hubo un problema al desloguear",
      });
    }
  },

  async getUserConnected(req, res) {
    try {
      const user = await User.findById(req.user._id)
        .populate({
          path: 'orderIds',
          populate: {
            path: 'eventsIds',
          },
        })
        .populate('wishList');
      res.send(user);
    } catch (error) {
      console.error(error);
    }
  },

  async followUser(req, res) {
    try {
      const user = await User.findById(req.params._id);
      const userConnected = await User.findById(req.user._id);

      const alreadyFollow = user.followers.includes(req.user._id);

      if (userConnected._id.toString() === user._id.toString()) {
        return res.status(400).send({ message: 'No puedes auto seguirte' });
      }

      if (alreadyFollow) {
        return res.status(400).send({ message: 'Ya sigues a este usuario' });
      }

      await User.findByIdAndUpdate(
        req.params._id,
        { $push: { followers: req.user._id } },
        { new: true }
      );
      res.send({ message: 'Siguiendo al usuario con exito' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Ha habido un problema con tu follow' });
    }
  },

  async unfollowUser(req, res) {
    try {
      const findUser = await User.findById(req.params._id);

      const alreadyFollow = findUser.followers.includes(req.user._id);

      if (alreadyFollow === false) {
        return res
          .status(400)
          .send({ message: 'Acabas de dejar de seguir a este usuario' });
      }

      await User.updateOne(
        findUser,
        { $pull: { followers: req.user._id } },
        { new: true }
      );

      res.send(findUser);
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .send({ message: 'Ha habido un problema con tu unfollow' });
    }
  },

  async update(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          name: req.body.name,
          surname: req.body.surname,
          avatar: req.file?.filename,
        },
        { new: true }
      );

      if (!user) {
        return res.status(400).send({ message: "This user doesn't exist" });
      }

      res.send({ message: 'User successfully updated', user });
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = UserController;
