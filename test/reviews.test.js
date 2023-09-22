const request = require("supertest");
const app = require("../index");
const Review = require("../models/Review");

describe("testing/users", () => {
  const review = {
    title: "Testing",
    body: "this is a test",
  };

  afterAll(async () => {
    return await Review.deleteOne({ title: "Testing" });
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

  test("Create a review", async () => {
    const res = await request(app)
      .post("/reviews/create")
      .send(review)
      .set({ Authorization: token })
      .expect(201);

    expect(res.body.review._id).toBeDefined();
    expect(res.body.review.userId).toBeDefined();
  });
});