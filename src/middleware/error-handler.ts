import { NextFunction, type Request, type Response } from "express"
import { SError } from "../utils/serror"

export const errorHandler = (
  err: SError,
  _: Request,
  res: Response,
  next: NextFunction
): void => {
    res.status(err.params.status).send({errors: err.params.msg})
    next()
}
