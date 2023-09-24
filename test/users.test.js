const request = require('supertest');
const app = require('../index');
const User = require('../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

describe('users', () => {
  let token;
  const user = {
    email: 'testing@test.com',
    password: 'test1234',
    confirmed: false,
    acceptPolicity: true,
    occupation: 'Tester',
    ecosystem: 'Tester',
    name: 'Testerodu',
    surname: 'The Tester',
    tel: '+34 00000001',
    bday: 0,
  };

  afterAll(async () => {
    await User.deleteMany({});
    await app.server.close();
    await mongoose.disconnect();
  });

  describe('Register', () => {
    test('email invalid', async () => {
      await request(app)
        .post('/users/registeruser')
        .send({ email: 'invalidEmail' })
        .expect(400);
    });

    test('success', async () => {
      const res = await request(app)
        .post('/users/registeruser')
        .send(user)
        .expect(201);

      expect(res.body.user._id).toBeDefined();
      expect(res.body.user.email).toBeDefined();
      expect(res.body.user.name).toBeDefined();
      expect(res.body.user.surname).toBeDefined();
      expect(res.body.user.password).not.toBeDefined();
    });

    test('user already exist', async () => {
      const res = await request(app)
        .post('/users/registeruser')
        .send(user)
        .expect(409);
    });
  });

  describe('userConfirm', () => {
    test('user with wrong token', async () => {
      const invalidToken = jwt.sign({ invalid: 'token' }, jwt_secret, {
        expiresIn: '48h',
      });
      await request(app).get(`/users/confirm/${invalidToken}`).expect(401);
    });

    test('user with valid token', async () => {
      const savedUser = await User.findOne({ email: user.email });
      const token = savedUser.tokens[0].token;
      await request(app).get(`/users/confirm/${token}`).expect(200);
    });
  });

  describe('Login', () => {
    test('incorrect credentials', async () => {
      const res = await request(app)
        .post('/users/loginuser')
        .send({ email: 'testing@test.com', password: 'ITypeitWrong' })
        .expect(401);
    });

    test('correct credentials', async () => {
      const res = await request(app)
        .post('/users/loginuser')
        .send({ email: 'testing@test.com', password: 'test1234' })
        .expect(200);
      expect(res.body.token).toBeDefined();
      token = res.body.token;
    });
  });

  describe('Update', () => {
    test('change user name', async () => {
      const res = await request(app)
        .put('/users/updateuser')
        .set({ Authorization: token })
        .send({ ...user, name: 'My new name' })
        .expect(200);

      expect(res.body.user.name).toBe('My new name');
    });

    test('user is unathorized', async () => {
      const invalidToken = jwt.sign({ invalid: 'token' }, jwt_secret, {
        expiresIn: '48h',
      });
      await request(app)
        .put('/users/updateuser')
        .set({ Authorization: invalidToken.toString() })
        .send({ ...user, name: 'My new name' })
        .expect(401);
    });
  });

  describe('Logout', () => {
    test('removes the token', async () => {
      const res = await request(app)
        .delete('/users/logout')
        .set({ Authorization: token })
        .send()
        .expect(200);
      const savedUser = await User.findOne({ email: user.email });
      expect(savedUser.tokens).toEqual([]);
    });
  });

  describe('recover password', () => {
    test('updating the password', async () => {
      await request(app)
        .post('/users/recoverpassword')
        .send({ email: user.email })
        .expect(201);

      const savedUser = await User.findOne({ email: user.email });
      const token = savedUser.tokens[0].token;

      await request(app)
        .put('/users/resetpassword')
        .send({ token, password: 'IWillNotForgetThisOne' })
        .expect(200);

      await request(app)
        .post('/users/loginuser')
        .send({ email: user.email, password: 'IWillNotForgetThisOne' })
        .expect(200);
    });
  });
});
