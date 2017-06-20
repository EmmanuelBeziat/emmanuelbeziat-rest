var express = require('express')
var app = express()
// var port = process.env.PORT || 3002
var port = 3002
// var posts = require('./api/models/postsModel.js')
var bodyParser = require('body-parser')
var routes = require('./api/routes/postsRoutes.js')

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

app.listen(port)

console.log('RESTful API server started on: ' + port)
