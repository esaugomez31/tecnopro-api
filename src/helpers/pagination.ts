import { iFilterSettings } from '../interfaces/filter.interfaces'

export const filtersettings = (params: any): iFilterSettings => {
  const page = Number(params.page)
  const limit = Number(params.limit)
  const orderBy = params.orderBy as string
  const orderDirection = params.orderDirection as string

  // Sorting settings
  const order: { [key: string]: 'ASC' | 'DESC' } = {}
  if (orderBy !== undefined) {
    order[orderBy] = orderDirection === 'ASC' ? 'ASC' : 'DESC'
  }

  // pagination settings
  const validPage = page > 0 ? page : 1
  const skip = (validPage - 1) * limit

  return { page, limit, skip, order }
}
