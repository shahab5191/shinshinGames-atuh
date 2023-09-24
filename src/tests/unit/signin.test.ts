import app from "../../app"
import Request from "supertest"
import { User } from "../../models/user"
import * as encryption from '../../utils/encryption'
describe.skip("testing signin route", () => {
  it("should return error if email is not valid", async () => {
    await Request(app)
      .post("/api/v1/users/signin")
      .send({ email: "", password: "password" })
      .expect(403)
    await Request(app)
      .post("/api/v1/users/signin")
      .send({ email: "test", password: "password" })
      .expect(403)
    await Request(app)
      .post("/api/v1/users/signin")
      .send({ email: "test@ss.", password: "password" })
      .expect(403)
  })

  it("should return error if password is not between 8 to 20 chars lentgh", async () => {
    await Request(app)
      .post("/api/v1/users/signin")
      .send({ email: "test@test.com", password: "" })
      .expect(403)
    await Request(app)
      .post("/api/v1/users/signin")
      .send({ email: "test@test.com", password: "123" })
      .expect(403)
    await Request(app)
      .post("/api/v1/users/signin")
      .send({ email: "test@test.com", password: "asdfghjklqwertyuiopzx" })
      .expect(403)
  })

  it("should return error if user does not exist with message: 'Email or Password is wrong!'", async () => {
    User.findOne = jest.fn().mockReturnValueOnce(null)
    const Response = await Request(app)
      .post("/api/v1/users/signin")
      .send({ email: "test@test.com", password: "password" })
      .expect(404)
    expect(Response.body).toHaveProperty("errors")
    expect(Response.body.errors[0]).toBe("Email or Password is wrong!")
  })

  it("should return error if password is wrong with message: 'Email or Password is wrong!", async () => {
    User.findOne = jest
      .fn()
      .mockReturnValueOnce({ hash: "hash", password: "password", salt: "salt" })
    const Response = await Request(app)
      .post("/api/v1/users/signin")
      .send({ email: "test@test.com", password: "password" })
      .expect(404)
    expect(Response.body).toHaveProperty("errors")
    expect(Response.body.errors[0]).toBe("Email or Password is wrong!")
  })
  it("should return {email, username, id, token} and session cookie if email and password are correct", async () => {
    jest.spyOn(encryption,'verify').mockReturnValue(true)
    User.findOne = jest
      .fn()
      .mockReturnValueOnce({ email: "email", password: "hash", salt: "salt",id: '123456', username:'' })

    const response = await Request(app)
      .post("/api/v1/users/signin")
      .send({ email: "test@test.com", password: "password" })
      .expect(200)

    expect(response.body).toHaveProperty('email')
    expect(response.body).toHaveProperty('username')
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('token')
    expect(response.headers).toHaveProperty('set-cookie')
    expect(response.headers['set-cookie'][0].split('=')[0]).toBe('session')
  })
})
