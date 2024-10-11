import dotenv from 'dotenv'
import { logger } from '../helpers'
import { iEnvs, TNode_env } from '../interfaces/config/environment.interface'

// Loading environment vars
const env: string = process.env.NODE_ENV as string
if (env !== 'production') {
  const pathEnv = env === 'development' ? '.env.development' : '.env.production'
  dotenv.config({ path: pathEnv })
}
// evaluate environment variables
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
    node_env: retrieveEnv('NODE_ENV') as TNode_env,
    port: retrieveEnv('PORT'),
    password_salt: Number(retrieveEnv('PASS_SALT_ROUNDS')),
    secret_jwt_key: retrieveEnv('SECRET_JWT_KEY'),
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
