import express, { NextFunction, Request, Response } from "express"
import { NOT_LOGGED_IN } from "../utils/error-messages"
import { SError } from "../utils/serror"
import { validateToken } from "../utils/encryption"

const router = express.Router()
router.get("/api/v1/users/current", async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session) {
    return next(new SError({ msg: [NOT_LOGGED_IN], status: 404 }))
  }
  const currentUser = validateToken(req.session.jwt)
  res.status(200).send(currentUser)
})

export { router as currentUserRoute }
