import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm'
import { BranchModel, BrandModel, CategoryModel, UserModel } from '.'

@Entity('products')
export class ProductModel extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_product' })
    idProduct?: number

  @Column({ type: 'varchar', length: 36, nullable: true })
    uuid: string | null

  @Column({ type: 'varchar', length: 50 })
    name: string

  @Column({ type: 'varchar', length: 100, nullable: true })
    description: string | null

  @Column({ type: 'varchar', length: 50, nullable: true })
    location: string | null

  @Column({ type: 'varchar', length: 20, nullable: true })
    code: string | null

  @Column({ type: 'varchar', length: 30, nullable: true })
    barcode: string | null

  @Column({ type: 'tinyint', default: 0, name: 'barcode_generated' })
    barcodeGenerated: number

  @Column({ type: 'decimal', precision: 11, scale: 4 })
    price: number

  @Column({ type: 'decimal', precision: 11, scale: 4, nullable: true, name: 'purchase_price' })
    purchasePrice: number | null

  @Column({ type: 'enum', enum: ['store', 'user'], default: 'store', name: 'purchased_by' })
    purchasedBy: 'store' | 'user'

  @Column({ type: 'int', default: 59, name: 'dte_unit_measure' })
    dteUnitMeasure: number

  @Column({ type: 'decimal', precision: 11, scale: 4, default: 0.00 })
    profit: number

  @Column({ type: 'decimal', precision: 11, scale: 4, default: 0.00, name: 'profit_percentage' })
    profitPercentage: number | null

  @Column({ type: 'decimal', precision: 11, scale: 4, default: 0.00, name: 'profit_user' })
    profitUser: number

  @Column({ type: 'decimal', precision: 11, scale: 4, default: 0.00, name: 'profit_percentage_user' })
    profitPercentageUser: number | null

  @Column({ type: 'decimal', precision: 11, scale: 4, default: 0.00, name: 'profit_branch' })
    profitBranch: number

  @Column({ type: 'decimal', precision: 11, scale: 4, default: 0.00, name: 'profit_percentage_branch' })
    profitPercentageBranch: number | null

  @Column({ type: 'decimal', precision: 11, scale: 4, default: 0.00, name: 'max_discount' })
    maxDiscount: number

  @Column({ type: 'decimal', precision: 11, scale: 4 })
    stock: number

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'image_url' })
    imageUrl: string | null

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
    brand?: BrandModel | null

  @ManyToOne(() => CategoryModel, { nullable: true })
  @JoinColumn({ name: 'id_category' })
    category?: CategoryModel | null

  @ManyToOne(() => UserModel, { nullable: true })
  @JoinColumn({ name: 'id_user' })
    user?: UserModel | null

  @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt?: Date

  @Column({ type: 'tinyint', default: 1 })
    status?: boolean
}
