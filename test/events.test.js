const request = require("supertest");
const app = require("../index");
const Event = require("../models/Event");

describe("testing/users", () => {
  const event = {
    title: "Testing",
    body: "this is a test",
  };

  afterAll(async () => {
    return await Event.deleteOne({ title: "Testing" });
  });

  let token;

  test("Login a user", async () => {
    const res = await request(app)
      .post("/users/loginuser")
      .send({ email: "testing2@test.com", password: "test1234" })
      .expect(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test("Create a event", async () => {
    const res = await request(app)
      .post("/events/create")
      .send(event)
      .set({ Authorization: token })
      .expect(201);

    expect(res.body.event._id).toBeDefined();
    expect(res.body.event.userId).toBeDefined();
  });
});