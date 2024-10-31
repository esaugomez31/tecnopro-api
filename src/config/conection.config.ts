import { DataSource } from 'typeorm'
import envs from './environment.config'
import {
  UserModel,
  RoleModel,
  BrandModel,
  CountryModel,
  CategoryModel,
  PermissionModel,
  RolePermissionModel
} from '../models'

const { host, username, password, database, port } = envs.app.db

export const AppDataSource = new DataSource({
  type: 'mysql',
  host,
  port,
  username,
  password,
  database,
  synchronize: false,
  logging: true,
  entities: [
    UserModel,
    RoleModel,
    BrandModel,
    CountryModel,
    CategoryModel,
    PermissionModel,
    RolePermissionModel
  ],
  subscribers: [],
  migrations: []
})
