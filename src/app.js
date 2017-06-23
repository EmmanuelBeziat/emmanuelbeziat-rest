const config = require('./config')

import express from 'express'
import mitanEko from 'mitan-eko'
import zouti from 'zouti'
import bodyParser from'body-parser'
import postsRoutes from './routes/posts.js'
import systemRoutes from './routes/system.js'

let app = express()
app.set('view engine', 'ejs')

app.use(mitanEko('NodeREST'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	'extended': true
}))

app.use(function (request, response, next) {
	response.setHeader('Access-Control-Allow-Origin', '*')
	response.setHeader('Access-Control-Allow-Methods', 'GET')
	response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
	response.setHeader('Access-Control-Allow-Credentials', true)
	next()
})

app.use(express.static('public'))

app.use(postsRoutes)
app.use(systemRoutes)

app.listen(config.port, () => {
	zouti.success(`RESTful API server started on ${config.port}.`)
})
