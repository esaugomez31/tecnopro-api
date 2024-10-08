import { DataSource } from 'typeorm'
import envs from './environment.config'

const { host, username, password, database, port } = envs.app.db

export const AppDataSource = new DataSource({
  type: 'mysql',
  host,
  port,
  username,
  password,
  database,
  synchronize: true,
  logging: true,
  entities: [],
  subscribers: [],
  migrations: []
})
