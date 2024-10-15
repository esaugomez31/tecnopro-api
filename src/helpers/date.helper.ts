import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const getLocalDateTimeNow = (): string => {
  const now = dayjs().utc()
  const formattedDateUTC = now.format('YYYY-MM-DD hh:mm:ss')

  return formattedDateUTC
}
