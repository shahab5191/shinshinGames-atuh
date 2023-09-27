import { INTERNAL_ERROR } from "../utils/error-messages"
import { SError } from "../utils/serror"
import { rabbitWrapper } from "./service"

export const consume = async (queue: string) => {
  const connection = rabbitWrapper.connection
  if (connection === undefined) {
    throw new SError({ msg: [INTERNAL_ERROR], status: 500 })
  }
  let channel
  try {
    channel = await connection.createChannel()
  } catch (error) {
    throw new SError({ msg: [INTERNAL_ERROR], status: 500 })
  }
  channel.assertQueue(queue, { durable: false })
  channel.consume(
    queue,
    (msg) => {
      console.log(msg?.content.toString())
    },
    { noAck: true }
  )
  return
}
