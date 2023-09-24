import request from "supertest"
import app from "../../app"
import { User } from "../../models/user"

describe.skip("unit tests for signup route", () => {
  it("should not accept invalid email", async () => {
    const response = await request(app)
      .post("/api/v1/users/signup")
      .send({ email: "", password: "password" })
      .expect(403)
    expect(response.body).toHaveProperty("errors")
    expect(response.body.errors[0]).toBe("Email is not valid")
  })

  it("should not accept invalid password", async () => {
    const response = await request(app)
      .post("/api/v1/users/signup")
      .send({ email: "test@test.com", password: "d" })
      .expect(403)
    expect(response.body).toHaveProperty("errors")
    expect(response.body.errors[0]).toBe("Password must be 8 to 20 characters long")
  })

  it("should not signup if email is already in use", async () => {
    User.findOne = jest.fn().mockReturnValueOnce("inuse")
    const response = await request(app)
      .post("/api/v1/users/signup")
      .send({ email: "test@test.com", password: "password" })
      .expect(409)
    expect(response.body).toHaveProperty("errors")
    expect(response.body.errors[0]).toBe("Email already exists")
  })

  it("should create new user if email is unique and password is not empty", async () => {
    User.findOne = jest.fn().mockReturnValueOnce("")
    User.create = jest.fn().mockReturnValueOnce({
      toJSON: () => {
        return { email: "test@test.com", password: "password" }
      },
    })
    await request(app)
      .post("/api/v1/users/signup")
      .send({ email: "test@test.com", password: "password" })
      .expect(201)
  })
})
