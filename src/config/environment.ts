import { logger } from '../helpers'
import { iEnvs } from './interfaces/environment.interface'

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
    port: retrieveEnv('PORT')
  }
}

export default envs
