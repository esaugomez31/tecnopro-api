export enum SystemPageEnum {
  BRANCHES = "branches",
  PRODUCTS = "products",
  CATEGORIES = "categories",
  BRANDS = "brands",
  SALES = "sales",
  SALES_HISTORY = "sales_history",
  CUSTOMERS = "customers",
  USERS = "users",
  ROLES = "roles",
  PERMISSIONS = "permissions",
}

export interface IPermission {
  idPermission?: number
  systemPage: SystemPageEnum
  permissionName: string
  createdAt?: Date
  updatedAt?: Date
  status: boolean
}
