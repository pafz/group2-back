const request = require('supertest');
const app = require('../index');
const Event = require('../models/Event');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

describe('events', () => {
  const event = {
    title: 'Testing',
    body: 'this is a test',
    time: '20:00',
    organization: 'Edem',
    category: 'Marketing',
    capacity: 400,
    date: Date.now(),
    price: 20,
    place: 'here',
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
    await Event.deleteMany({});
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

  test('Create a event', async () => {
    const res = await request(app)
      .post('/events/create')
      .send(event)
      .set({ Authorization: token })
      .expect(201);

    expect(res.body.event._id).toBeDefined();
    expect(res.body.event.userId).toBeDefined();
  });
});
