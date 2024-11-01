export interface iFilterSettings {
  page: number
  skip: number
  limit: number
  order: { [key: string]: 'ASC' | 'DESC' }
  include?: string[]
}
