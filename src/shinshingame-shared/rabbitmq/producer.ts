import { rabbitWrapper } from "./service"
import { SError } from "../utils/serror"
import { INTERNAL_ERROR } from "../utils/error-messages"

export const sendMessage = async (
  message: unknown,
  queue: string
) => {
  const connection = rabbitWrapper.connection
  if (connection === undefined) {
    throw new SError({ msg: [INTERNAL_ERROR], status: 500 })
  }
  const channel = await connection.createChannel()
  const msg = JSON.stringify(message)
  channel.assertQueue(queue, {durable:false})
  channel.sendToQueue(queue, Buffer.from(msg))
  console.log("\x1b[33m [RabbitMQ] sent %s\x1b[0m", msg)
}
