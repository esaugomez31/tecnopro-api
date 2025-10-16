import { Like } from "typeorm"

export const applyFilter = (
  filters: object,
  field: string,
  value: unknown,
  useLike: boolean = false,
): void => {
  if (value !== undefined) {
    const dict = filters as Record<string, unknown>
    dict[field] = useLike ? Like(`%${String(value)}%`) : value
  }
}
