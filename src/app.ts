import express, { type Application } from "express"
import morgan from "morgan"
import cookieSession from "cookie-session"

import { signupRouter } from "./routes/signup"
import { signinRouter } from "./routes/signin"
import { currentUserRoute } from "./routes/current-user"

import { authorize } from "./middleware/authorize"
import { SError } from "./shinshingame-shared/utils/serror"
import { INTERNAL_ERROR } from "./shinshingame-shared/utils/error-messages"
import { errorHandler } from "./shinshingame-shared/middleware/error-handler"

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
app.use(authorize)
app.use(currentUserRoute)
app.all("*", (_, res) => {
  res.status(404).send({ error: "404 - Address was not found!" })
})
app.use(errorHandler)
export default app
