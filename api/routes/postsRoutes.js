'use strict'

module.exports = function (app) {
	var articles = require('../controllers/articlesController.js')
	var portfolio = require('../controllers/portfolioController.js')
	var projects = require('../controllers/projectsController.js')

	// Home
	app.get('/', function (req, res) {
		res.render('home.ejs', { message: 'Bienvenue' })
	})

	// Posts routes
	app.route('/posts').get(articles.listAll)
	app.route('/posts/:slug').get(articles.getSingle)

	app.route('/portfolio').get(portfolio.listAll)
	app.route('/portfolio/:slug').get(portfolio.getSingle)
	
	app.route('/projects').get(projects.listAll)
	app.route('/projects/:slug').get(projects.getSingle)

	app.get('*', function (request, response) {
		response.send('There is no valid data here', 404)
	})
}
