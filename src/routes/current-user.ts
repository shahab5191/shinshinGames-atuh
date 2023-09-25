import express, { Request, Response } from "express"
import { validateToken } from "../utils/encryption"

const router = express.Router()
router.get("/api/v1/users/current", async (req: Request, res: Response) => {
  const currentUser = validateToken(req.session?.jwt)
  return res.status(200).send(currentUser)
})

export { router as currentUserRoute }
