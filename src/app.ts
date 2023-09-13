import express, { type Application } from "express"
import morgan from "morgan"
import { signupRouter } from "./routes/signup"
import { signinRouter } from "./routes/signin"
import { errorHandler } from "./middleware/error-handler"

const app: Application = express()
// if (process.env.JWT_SECRET === undefined) {
//   throw new SBError(INTERNAL_ERROR, "jwt secret is not available!")
// }

app.set("trust proxy", true)
app.use(express.json())
app.use(morgan("tiny"))

app.use(signupRouter)
app.use(signinRouter)
app.all("*", (req, res) => {
  res.status(404).send({ error: "404 - Address was not found!" })
})
app.use(errorHandler)
export default app
