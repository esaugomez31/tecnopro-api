import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

export enum systemPageEnum {
  PRODUCTS = 'products',
  CATEGORIES = 'categories',
  SALES = 'sales',
  SALES_HISTORY = 'sales_history',
  CUSTOMERS = 'customers',
  USERS = 'users',
  ROLES = 'roles',
  PERMISSIONS = 'permissions'
}

@Entity('permissions')
export class PermissionModel extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_permission' })
    idPermission?: number

  @Column({ type: 'enum', enum: systemPageEnum, name: 'system_page' })
    systemPage: systemPageEnum

  @Column({ type: 'varchar', length: 25, name: 'permission_name' })
    permissionName: string

  @Column({ type: 'tinyint', default: 1 })
    status: boolean
}
