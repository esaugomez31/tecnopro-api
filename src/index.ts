import envs from './config/environment.config'
import { AppDataSource } from './config/conection'
import { logger } from './helpers/logger'
import app from './app'

const main = async (): Promise<void> => {
  try {
    const port = envs.app.port
    await AppDataSource.initialize()

    // Starting server....
    app.listen(port, () => {
      logger.info(`Tecnopro API is listening at ${port} port...`)
    })
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message)
    }
  }
}

main().catch((error) => {
  logger.error('Unknow error: ', error)
})
