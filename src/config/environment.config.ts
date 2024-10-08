import { logger } from '../helpers'
import { iEnvs } from '../interfaces/config/environment.interface'

const retrieveEnv = (variableName: string): string => {
  const variable: string = process.env[variableName] ?? ''
  if (variable === '') {
    logger.error(`Variable: "${variableName}", is not set`)
    process.exit(1)
  }
  return variable
}

const envs: iEnvs = {
  app: {
    port: retrieveEnv('PORT'),
    db: {
      host: retrieveEnv('DB_HOST'),
      database: retrieveEnv('DB_NAME'),
      port: Number(retrieveEnv('DB_PORT')),
      username: retrieveEnv('DB_USER'),
      password: retrieveEnv('DB_PASSWORD')
    }
  }
}

export default envs
