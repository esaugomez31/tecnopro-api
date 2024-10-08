export interface iEnvs {
  app: iApp
}

interface iApp {
  port: string
  db: iDB
}

interface iDB {
  host: string
  database: string
  port: number
  username: string
  password: string
}
