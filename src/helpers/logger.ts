import pino from 'pino'

const transport = pino.transport({
  target: 'pino-pretty'
})

export const logger = pino(
  {
    level: process.env.LOG_LEVEL ?? 'info',
    redact: ['poolKeys'],
    serializers: {
      error: pino.stdSerializers.err
    },
    base: undefined
  },
  transport
)
