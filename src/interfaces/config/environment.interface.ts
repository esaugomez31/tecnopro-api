export interface iEnvs {
  app: iApp
}

interface iApp {
  node_env: TNode_env
  port: string
  password_salt: number
  db: iDB
  secret_jwt_key: string
}

interface iDB {
  host: string
  database: string
  port: number
  username: string
  password: string
}

export type TNode_env = 'production' | 'development' | 'production-local'
