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
      await User.findOneAndUpdate(
        { 'tokens.token': token },
        { confirmed: true },
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
        return res.status(409).json({ message: 'El usuario ya existe' });
      }

      const emailToken = jwt.sign({ mail: req.body.mail }, jwt_secret, {
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
        tokens: [{ token: emailToken.toString() }],
        avatar: req.file?.filename,
      });

      const BASE_URL = 'http://localhost:3000'; // TODO: Usar la base url correcta (extraer a variable de entorno);
      const url = `${BASE_URL}/users/confirm/${emailToken}`;

      await transporter.sendMail({
        to: email,
        subject: 'MdE Confirmaci&oacute;n de registro',
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

  async loginUser(req, res, next) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'Credenciales no válidas' });
      }

      // if (!user.confirmed) {
      //   return res.status(400).send({ message: 'Debes confirmar tu email' });
      // }

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

      res.status(200).json({ message: 'Bienvenidx ' + user.name, token, user }); //TODO: añadido user para guardar todo el user en front
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error durante el login' });
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
        message: 'Hubo un problema al desloguear',
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
      } else {
        const user = await User.findByIdAndUpdate(
          req.params._id,
          { $push: { followers: req.user._id } },
          { new: true }
        );
        res.send(user);
      }
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
          email: req.body.email,
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
