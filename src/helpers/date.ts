import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const getDateTimeNowUTC = (): string => {
  const now = dayjs()
  const formattedDateUTC = now.format('YYYY-MM-DD HH:mm:ss')

  return formattedDateUTC
}

export const convertUTCPerTimezone = (inputDateTime: Date, timezone: string): string => {
  const date = dayjs(inputDateTime).utc()
  const localTime = date.tz(timezone).format('YYYY-MM-DD HH:mm:ss')
  return localTime
}
