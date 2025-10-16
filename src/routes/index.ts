import express from "express"

import api from "./api"

const routes = express.Router()

routes.use("/api", api)

routes.get("/ping", (_, request) => {
  request.send("ok")
})

export = routes
