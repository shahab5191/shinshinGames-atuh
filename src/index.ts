import { sequelize } from "./db/connect"
import app from "./app"
import { rabbitWrapper } from "./shinshingame-shared/rabbitmq/service"

let port = 4000
if (process.env.PORT !== undefined) {
  port = Number(process.env.PORT)
}
if(process.env.RABBITMQ_PORT === undefined || process.env.RABBITMQ_URL === undefined){
  throw new Error('rabbitmq url was not found!')
}
const startService = async (): Promise<void> => {
  await rabbitWrapper.connect(process.env.RABBITMQ_URL!, Number(process.env.RABBITMQ_PORT))
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
