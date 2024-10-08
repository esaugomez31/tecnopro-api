import express from 'express'

const routes = express.Router()

routes.post('/register', (_, res) => {
  res.send('register')
})

routes.post('/login', (_, res) => {
  res.send('Login')
})

routes.post('/logout', (_, res) => {
  res.send('logout')
})

export default routes
