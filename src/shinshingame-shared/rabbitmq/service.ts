import amqp, { Connection } from "amqplib"

class RabbitMQService {
  private _connection: Connection | undefined
  private _server: string | undefined

  public get connection() {
    return this._connection
  }

  async connect(amqpUrl: string, amqpPort: number) {
    this._server = `${amqpUrl}:${amqpPort}`
    const delay = 500
    const maxTries = 5
    const currentTry = 0
    // console.log("testing timeout")
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    // console.log("test ended")

    const tryConnecting = async (
      server: string,
      currentTry: number,
      maxTries: number,
      delay: number
    ): Promise<Connection> => {
      console.log('trying to connect to rabbitMQ...')
      try {
        return await amqp.connect(server)
      } catch (error) {
        if (currentTry < maxTries) {
          await new Promise((resolve) => setTimeout(resolve, delay))
          return tryConnecting(server, currentTry + 1, maxTries, delay * maxTries)
        } else {
          throw new Error("cannot connect to rabbit")
        }
      }
    }

    this._connection = await tryConnecting(
      this._server,
      currentTry,
      maxTries,
      delay
    )
    console.log('connection to rabbitMQ established!')
  }
}

export const rabbitWrapper = new RabbitMQService()
