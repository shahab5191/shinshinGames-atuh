"use strict"
import { Model, DataTypes } from "sequelize"
import { sequelize } from "../db/connect"

export class User extends Model {
  declare id: string
  declare email: string
  declare firstName: string
  declare userName: string
  declare salt: string
  declare password: string
}
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: { type: DataTypes.STRING },
    userName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    salt: {type: DataTypes.STRING, allowNull:false}
  },
  {
    sequelize,
    modelName: "User",
  }
)
