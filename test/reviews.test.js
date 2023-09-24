const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../index');
const Review = require('../models/Review');
const User = require('../models/User');
const mongoose = require('mongoose');

describe('reviews', () => {
  const review = {
    title: 'Testing',
    body: 'this is a test',
  };

  const hashedPassword = bcrypt.hashSync('test1234', 10);
  beforeAll(() =>
    User.create({
      email: 'testing2@test.com',
      password: hashedPassword,
      confirmed: true,
      acceptPolicity: true,
      occupation: 'Tester',
      ecosystem: 'Tester',
      name: 'Tester',
      surname: 'Tester',
      tel: 'Tester',
      bday: 0,
    })
  );

  afterAll(async () => {
    await Review.deleteMany({});
    await User.deleteMany({});
    await app.server.close();
    await mongoose.disconnect();
  });

  let token;

  test('Login a user', async () => {
    const res = await request(app)
      .post('/users/loginuser')
      .send({ email: 'testing2@test.com', password: 'test1234' })
      .expect(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test('Create a review', async () => {
    const res = await request(app)
      .post('/reviews/create')
      .send(review)
      .set({ Authorization: token })
      .expect(201);
    expect(res.body.review._id).toBeDefined();
    expect(res.body.review.userId).toBeDefined();
  });
});
