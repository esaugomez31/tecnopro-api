import { iFilterSettings } from '../interfaces/filter.interfaces'

export const filtersettings = (params: any): iFilterSettings => {
  const page = params.page
  const limit = params.limit
  const orderBy = params.orderBy
  const orderDirection = params.orderDirection
  const include = params.include?.split(',')

  // Sorting settings
  const order: { [key: string]: 'ASC' | 'DESC' } = {}
  if (orderBy !== undefined) {
    order[orderBy] = orderDirection === 'ASC' ? 'ASC' : 'DESC'
  }

  // pagination settings
  const validPage = page > 0 ? page : 1
  const skip = (validPage - 1) * limit

  return { page, limit, skip, order, include }
}
