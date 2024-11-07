import { Like } from 'typeorm'

export const applyFilter = (filters: any, field: string, value: any, useLike: boolean = false): void => {
  if (value !== undefined) {
    filters[field] = useLike ? Like(`%${value as string}%`) : value
  }
}
