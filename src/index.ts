import express from 'express'
import routes from './routes'
import envs from './config/environment'

const app = express()
app.use(express.json())

app.use(routes)

// Starting res API....
app.listen(envs.app.port, () => {
  return console.log(`Tecnopro API is listening at ${envs.app.port} port...`)
})
