import { CorsOptions } from "cors"

import envs from "../config/environment.config"

export const corsOptions = (): CorsOptions => {
  const whiteList = envs.app.whiteList?.split(",") ?? []

  return {
    origin: (origin, callback) => {
      if (origin === undefined || whiteList.includes(origin)) {
        return callback(null, true)
      }

      // Throw cors error
      return callback(new Error(`CORS error: origin "${origin}" not authorized.`))
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Recaptchatoken"],
    credentials: true,
  }
}
