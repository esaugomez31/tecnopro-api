export interface iEnvs {
  app: iApp
}

interface iApp {
  nodeEnv: TypeNodeEnv
  port: string
  passwordSalt: number
  db: iDB
  secretJwtKey: string
  secretJwtRefreshKey: string
  whiteList: string
  defaultUser: {
    name: string
    email: string
    password: string
  }
  recaptcha: {
    enabled: boolean
    privateKey: string
  }
}

interface iDB {
  host: string
  database: string
  port: number
  username: string
  password: string
}

export type TypeNodeEnv = "production" | "development" | "production-local"
