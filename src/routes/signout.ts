import express, { type Request, type Response } from "express"

const router = express.Router()

router.get("/api/v1/users/signout", (req: Request, res: Response) => {
  req.session = {}
  res.clearCookie('session').status(200).send({msg: 'Signed out successfully'})
})

export {router as signoutRouter}
