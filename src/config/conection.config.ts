import { DataSource } from "typeorm"

import {
  UserModel,
  RoleModel,
  BrandModel,
  BranchModel,
  SaleModel,
  SaleDetailModel,
  CountryModel,
  DepartmentModel,
  MunicipalityModel,
  CategoryModel,
  CustomerModel,
  ProductModel,
  PermissionModel,
  TokenModel,
  RolePermissionModel,
} from "../models"

import envs from "./environment.config"

const { host, username, password, database, port } = envs.app.db

export const AppDataSource = new DataSource({
  type: "mysql",
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
    BranchModel,
    SaleModel,
    SaleDetailModel,
    CountryModel,
    DepartmentModel,
    MunicipalityModel,
    CategoryModel,
    CustomerModel,
    ProductModel,
    PermissionModel,
    TokenModel,
    RolePermissionModel,
  ],
  subscribers: [],
  migrations: [],
})
