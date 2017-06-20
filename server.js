const config = require('./config')
const express = require('express')
const app = express()

// const posts = require('./api/models/postsModel.js')
const bodyParser = require('body-parser')
const routes = require('./api/routes/postsRoutes.js')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'GET')
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
	res.setHeader('Access-Control-Allow-Credentials', true)
	next()
})

app.use(express.static('public'))

routes(app)

app.listen(config.port)

console.log('RESTful API server started on: ' + config.port)
