import { sequelize } from "./db/connect"
import app from "./app"

let port = 4000
if (process.env.PORT !== undefined) {
  port = Number(process.env.PORT)
}

const startService = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ force: true })
    console.log("Connection to database has been established successfully")
    app.listen(port, () => {
      console.log(`🖥️ is running on port ${port}!`)
    })
  } catch (error) {
    console.log(error)
    return
  }
}

void startService()
