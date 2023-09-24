import app from "../../app"
import Request from "supertest"
describe("testing current user route", () => {
  it("should return {username, email, id} if token is valid", async () => {
    const response = await Request(app).get('/api/v1/users/current').set('Cookie',["session=test"]).send()
    console.log(response.body)
  })
})
