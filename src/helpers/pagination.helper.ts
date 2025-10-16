import { IFilterSettings } from "../interfaces/filter.interfaces"

export const filtersettings = (params: Record<string, unknown>): IFilterSettings => {
  const page = params.page as number
  const limit = params.limit as number
  const orderBy = params.orderBy as string | undefined
  const orderDirection = params.orderDirection as "ASC" | "DESC" | undefined
  const include = (params.include as string | undefined)?.split(",")

  // Sorting settings
  const order: Record<string, "ASC" | "DESC"> = {}
  if (orderBy !== undefined) {
    order[orderBy] = orderDirection === "ASC" ? "ASC" : "DESC"
  }

  // pagination settings
  const validPage = page > 0 ? page : 1
  const skip = (validPage - 1) * limit

  return { page, limit, skip, order, include }
}
