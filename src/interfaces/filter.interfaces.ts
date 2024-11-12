export interface IFilterSettings {
  page: number
  skip: number
  limit: number
  order: { [key: string]: 'ASC' | 'DESC' }
  include?: string[]
}
