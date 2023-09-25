"use strict"
import { pbkdf2Sync, randomBytes } from "node:crypto"
import { SError } from "./serror"
import { INTERNAL_ERROR } from "./error-messages"
import jwt from "jsonwebtoken"
interface CreateTokenParams {
  id: string
  username: string
  email: string
}

export const hash = (
  password: string
): { hashedString: string; salt: string } => {
  let hashedString

  const salt = randomBytes(16).toString("hex")

  try {
    hashedString = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString(
      "hex"
    )
  } catch (error) {
    throw new SError({
      msg: [INTERNAL_ERROR],
      status: 500,
      log: "[Error] : Hash function Error",
    })
  }

  return { hashedString, salt }
}

export const verify = (password: string, hash: string, salt: string) => {
  let hashedString: string
  try {
    hashedString = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString(
      "hex"
    )
  } catch (error) {
    throw new SError({
      msg: [INTERNAL_ERROR],
      status: 500,
      log: "[Error] : Hash function Error",
    })
  }
  return hashedString === hash
}

export const createToken = (params: CreateTokenParams) => {
  return jwt.sign(
    { id: params.id, email: params.email, username: params.username },
    process.env.JWT_SECRET!
  )
}

export const validateToken = (token: string) => {
  let verfiedToken
  try {
    verfiedToken = jwt.verify(token, process.env.JWT_SECRET!)
  } catch (error) {
    return null
  }
  return verfiedToken
}
