var express = require('express')
var app = express()
var port = process.env.PORT || 3001
var posts = require('./api/models/postsModel.js')
var bodyParser = require('body-parser')
var routes = require('./api/routes/postsRoutes.js')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

routes(app)

app.listen(port)

console.log('RESTful API server started on: ' + port)
