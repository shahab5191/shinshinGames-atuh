import express, { NextFunction, Request, Response } from "express"
import { body, validationResult } from "express-validator"
import { User } from "../models/user"
import { verify } from "../utils/encryption"
import { SError } from "../utils/serror"
import { EMAIL_OR_PASSWORD_NOT_VALID, EMAIL_OR_PASSWORD_WRONG } from "../utils/error-messages"

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
    /** TODO: create unified Error handler */
    if (foundUser === null) {
      return res.status(404).send({ errors: [EMAIL_OR_PASSWORD_WRONG] })
    }

    if (!verify(password, foundUser.email, foundUser.salt)) {
      return res.status(404).send({ errors: [EMAIL_OR_PASSWORD_WRONG] })
    }

    return res
      .status(200)
      .send({ id: foundUser.id, email, username: foundUser.userName })
  }
)

export { router as signinRouter }
