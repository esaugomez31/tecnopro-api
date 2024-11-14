import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import routes from './routes'
import { corsOptions } from './middlewares'

const app = express()

app.use(cors(corsOptions()))
app.use(express.json())
app.use(cookieParser())
app.use(routes)

export default app
