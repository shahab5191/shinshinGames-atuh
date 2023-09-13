import { INTERNAL_ERROR, SBError } from "@shahab5191/shared"
import { Sequelize } from "sequelize"
import dotenv from "dotenv"
dotenv.config()
const POSTGRES_USERNAME = process.env.POSTGRES_USERNAME
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD
const POSTGRES_ADDRESS = process.env.POSTGRES_ADDRESS
const POSTGRES_PORT = process.env.POSTGRES_PORT
if (
  POSTGRES_PASSWORD === undefined ||
  POSTGRES_ADDRESS === undefined ||
  POSTGRES_PORT === undefined ||
  POSTGRES_USERNAME === undefined
) {
  throw new SBError(INTERNAL_ERROR, "Postgress data is not available")
}
const POSTGRESS_URL = `postgres://shahab:${POSTGRES_PASSWORD}@${POSTGRES_ADDRESS}:${POSTGRES_PORT}`
const sequelize = new Sequelize(POSTGRESS_URL)

export { sequelize }
