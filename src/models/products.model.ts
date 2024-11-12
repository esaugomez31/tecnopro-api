import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm'
import { BranchModel, BrandModel, CategoryModel, UserModel } from '.'

@Entity('products')
export class ProductModel extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_product' })
    idProduct?: number

  @Column({ type: 'varchar', length: 36, nullable: true })
    uuid: string

  @Column({ type: 'varchar', length: 50 })
    name: string

  @Column({ type: 'varchar', length: 100, nullable: true })
    description: string

  @Column({ type: 'varchar', length: 50, nullable: true })
    location: string

  @Column({ type: 'varchar', length: 20, nullable: true })
    code: string

  @Column({ type: 'varchar', length: 30, nullable: true })
    barcode: string

  @Column({ type: 'tinyint', default: 0, name: 'barcode_generated' })
    barcodeGenerated: number

  @Column({ type: 'decimal', precision: 11, scale: 4 })
    price: number

  @Column({ type: 'decimal', precision: 11, scale: 4, default: 0.00, name: 'purchase_price' })
    purchasePrice?: number

  @Column({ type: 'enum', enum: ['store', 'user'], default: 'store', name: 'purchased_by' })
    purchasedBy?: 'store' | 'user'

  @Column({ type: 'int', default: 59, name: 'dte_unit_measure' })
    dteUnitMeasure: number

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00, name: 'user_commission_percentage' })
    userCommissionPercent?: number

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100.00, name: 'branch_commission_percentage' })
    branchCommissionPercent?: number

  @Column({ type: 'decimal', precision: 11, scale: 4, default: 0.00, name: 'min_price' })
    minPrice: number

  @Column({ type: 'decimal', precision: 11, scale: 4 })
    stock: number

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'image_url' })
    imageUrl: string

  @Column({ name: 'id_branch', nullable: false })
    idBranch: number

  @Column({ name: 'id_brand', nullable: true })
    idBrand?: number

  @Column({ name: 'id_category', nullable: true })
    idCategory?: number

  @Column({ name: 'id_user', nullable: true })
    idUser?: number

  @ManyToOne(() => BranchModel)
  @JoinColumn({ name: 'id_branch' })
    branch?: BranchModel

  @ManyToOne(() => BrandModel, { nullable: true })
  @JoinColumn({ name: 'id_brand' })
    brand?: BrandModel

  @ManyToOne(() => CategoryModel, { nullable: true })
  @JoinColumn({ name: 'id_category' })
    category?: CategoryModel

  @ManyToOne(() => UserModel, { nullable: true })
  @JoinColumn({ name: 'id_user' })
    user?: UserModel

  @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt?: Date

  @Column({ type: 'tinyint', default: 1 })
    status?: boolean
}
