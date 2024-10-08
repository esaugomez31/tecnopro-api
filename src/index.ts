import express from 'express'
import routes from './routes'
import envs from './config/environment.config'

const app = express()
const port = envs.app.port

app.use(express.json())
app.use(routes)

// Starting res API....
app.listen(port, () => {
  return console.log(`Tecnopro API is listening at ${port} port...`)
})
