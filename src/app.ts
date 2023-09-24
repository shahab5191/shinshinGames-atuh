import express, { type Application } from "express"
import morgan from "morgan"
import cookieSession from "cookie-session"

import { signupRouter } from "./routes/signup"
import { signinRouter } from "./routes/signin"
import { currentUserRoute } from "./routes/current-user"
import { errorHandler } from "./middleware/error-handler"
import { SError } from "./utils/serror"
import { INTERNAL_ERROR } from "./utils/error-messages"

const app: Application = express()
if (process.env.JWT_SECRET === undefined) {
  throw new SError({ msg: [INTERNAL_ERROR], status: 500 })
}

app.set("trust proxy", true)
app.use(express.json())
app.use(morgan("tiny"))
app.use(
  cookieSession({
    name: "session",
    signed: false,
    secure: false,
  })
)

app.use(signupRouter)
app.use(signinRouter)
app.use(currentUserRoute)
app.all("*", (req, res) => {
  res.status(404).send({ error: "404 - Address was not found!" })
})
app.use(errorHandler)
export default app
