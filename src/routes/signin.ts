import express, { NextFunction, Request, Response } from "express"
import { body, validationResult } from "express-validator"
import { User } from "../models/user"
import { createToken, verify } from "../utils/encryption"
import { EMAIL_OR_PASSWORD_NOT_VALID, EMAIL_OR_PASSWORD_WRONG } from "../shinshingame-shared/utils/error-messages"
import { SError } from "../shinshingame-shared/utils/serror"


const router = express.Router()

router.post(
  "/api/v1/users/signin",
  [
    body("email").isEmail().withMessage(EMAIL_OR_PASSWORD_NOT_VALID),
    body("password")
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage(EMAIL_OR_PASSWORD_NOT_VALID),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      next(new SError({ msg: [], status: 403 }, errors.array()))
      return
    }

    const { email, password } = req.body

    const foundUser = await User.findOne({ where: { email } })
    if (foundUser === null) {
      return next(new SError({ msg: [EMAIL_OR_PASSWORD_WRONG], status: 404 }))
    }

    if (!verify(password, foundUser.password, foundUser.salt)) {
      return next(new SError({ msg: [EMAIL_OR_PASSWORD_WRONG], status: 404 }))
    }
    const token = createToken({
      id: foundUser.id,
      email,
      username: foundUser.userName,
    })

    req.session = {jwt: token}
    return res
      .status(200)
      .send({ id: foundUser.id, email, username: foundUser.userName? foundUser.userName : '', token })
  }
)

export { router as signinRouter }
