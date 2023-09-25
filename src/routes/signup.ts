import express, { NextFunction, Request, Response } from "express"
import { User } from "../models/user"
import { body, validationResult } from "express-validator"
import { createToken, hash } from "../utils/encryption"
import { SError } from "../utils/serror"
import {
  EMAIL_IN_USE,
  EMAIL_NOT_VALID,
  PASSWORD_NOT_VALID,
} from "../utils/error-messages"
const router = express.Router()

router.post(
  "/api/v1/users/signup",
  [
    body("email").isEmail().withMessage(EMAIL_NOT_VALID),
    body("password")
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage(PASSWORD_NOT_VALID),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      next(
        new SError(
          {
            msg: [],
            status: 403,
          },
          errors.array()
        )
      )
      return
    }
    const { email, password } = req.body

    const emailNotAvailable = await User.findOne({ where: { email } })

    if (emailNotAvailable) {
      next(new SError({ msg: [EMAIL_IN_USE], status: 409 }))
      return
    }

    const hashResult = hash(password)
    const newUser = await User.create({
      email,
      password: hashResult.hashedString,
      salt: hashResult.salt,
    })
    const token = createToken({
      email,
      id: newUser.id,
      username: newUser.userName,
    })
    req.session = { jwt: token }
    res.status(201).send({ id: newUser.id, email: newUser.email })
  }
)
export { router as signupRouter }
