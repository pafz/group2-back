const request = require("supertest");
const app = require("../index");
const User = require("../models/User");

describe("testing/users", () => {
  const user = {
    name: "Testing",
    surname: "Tested",
    email: "testing@test.com",
    password: "test1234",
    password2: "test1234",
  };

  afterAll(async () => {
    return await User.deleteOne({ email: "testing@test.com" });
  });

  test("Create a user", async () => {
    const res = await request(app)
      .post("/users/registeruser")
      .send(user)
      .expect(201);

    expect(res.body.user._id).toBeDefined();
    expect(res.body.user.email).toBeDefined();
    expect(res.body.user.name).toBeDefined();
    expect(res.body.user.surname).toBeDefined();

  });

  test("Confirm a user", async () => {
    const res = await request(app)
      .get("/users/userConfirm/testing@test.com")
      .expect(201);

    expect(res.text).toBe('Su correo ha sido validado, ya puede hacer login!');
  });

  let token;

  test("Login a user", async () => {
    const res = await request(app)
      .post("/users/loginuser")
      .send({ email: "testing@test.com", password: "test1234" })
      .expect(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
});
   
    
  });
