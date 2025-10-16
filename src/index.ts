import envs from "./config/environment.config"
import { AppDataSource } from "./config/conection.config"
import { generateFirstUser } from "./services/users.service"
import { logger } from "./helpers"
import app from "./app"

const main = async (): Promise<void> => {
  try {
    const port = envs.app.port
    // initialize database connection
    await AppDataSource.initialize()

    // Evaluate first user creation
    await generateFirstUser()

    // Starting server....
    app.listen(port, () => {
      logger.info(`API is listening at ${port} port...`)
    })
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message)
    }
  }
}

main().catch((error) => {
  logger.error("Unknow error: ", error)
})
