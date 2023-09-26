const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../index');
const Review = require('../models/Review');
const { addUser, deleteAllusers } = require('./helper');

describe('reviews', () => {
  const review = {
    title: 'Testing',
    body: 'this is a test',
  };

  beforeAll(() => addUser('testing2@test.com', 'test1234'));

  afterAll(async () => {
    await Review.deleteMany({});
    await deleteAllusers();
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
