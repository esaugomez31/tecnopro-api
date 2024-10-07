import express from 'express'

const routes = express.Router()

routes.route('/api')

routes.get('/ping', (_, request) => {
  request.send('ok')
})

export = routes
