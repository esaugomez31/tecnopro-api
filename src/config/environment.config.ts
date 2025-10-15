import dotenv from "dotenv"

import { logger } from "../helpers"
import { iEnvs, TypeNodeEnv } from "../interfaces/config/environment.interface"

// Loading environment vars
const env: string = process.env.NODE_ENV as string
if (env !== "production") {
  const pathEnv = env === "development" ? ".env.development" : ".env.production"
  dotenv.config({ path: pathEnv })
}
// evaluate environment variables
const retrieveEnv = (variableName: string): string => {
  const variable: string = process.env[variableName] ?? ""
  if (variable === "") {
    logger.error(`Variable: "${variableName}", is not set`)
    process.exit(1)
  }
  return variable
}

const envs: iEnvs = {
  app: {
    nodeEnv: retrieveEnv("NODE_ENV") as TypeNodeEnv,
    port: retrieveEnv("PORT"),
    passwordSalt: Number(retrieveEnv("PASS_SALT_ROUNDS")),
    secretJwtKey: retrieveEnv("SECRET_JWT_KEY"),
    secretJwtRefreshKey: retrieveEnv("SECRET_JWT_REFRESH_KEY"),
    whiteList: retrieveEnv("WHITE_LIST") ?? "",
    recaptcha: {
      enabled: retrieveEnv("ENABLE_RECAPTCHA")?.toLocaleLowerCase() === "true",
      privateKey: retrieveEnv("RECAPTCHA_PRIVATE_KEY") ?? "",
    },
    defaultUser: {
      name: retrieveEnv("DEFAULT_USER_NAME"),
      email: retrieveEnv("DEFAULT_USER_EMAIL"),
      password: retrieveEnv("DEFAULT_USER_PASSWORD"),
    },
    db: {
      host: retrieveEnv("DB_HOST"),
      database: retrieveEnv("DB_NAME"),
      port: Number(retrieveEnv("DB_PORT")),
      username: retrieveEnv("DB_USER"),
      password: retrieveEnv("DB_PASSWORD"),
    },
  },
}

export default envs
