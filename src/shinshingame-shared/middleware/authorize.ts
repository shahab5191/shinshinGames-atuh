import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

export const authorize =(req:Request, res:Response, next: NextFunction) => {
  if(!req.session || !req.session.isPopulated){
    return res.status(403).send({msg: 'Unauthorized access!'})
  }
  if(!verify(req.session?.jwt, process.env.JWT_SECRET!)){
    return res.status(403).send({msg: 'Unauthorized access!'})
  }
  return next()
}

