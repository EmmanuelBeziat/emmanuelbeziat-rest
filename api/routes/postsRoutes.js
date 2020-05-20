'use strict'

module.exports = function (app) {
	var articles = require('../controllers/articlesController.js')
	var portfolio = require('../controllers/portfolioController.js')
	var codes = require('../controllers/codesController.js')

	// Home
	app.get('/', function (req, res) {
		res.render('home.ejs', { message: 'Bienvenue' })
	})

	// Health check
	app.get('/health-check', (req, res) => res.sendStatus(200))

	// Posts routes
	app.route('/posts').get(articles.listAll)
	app.route('/posts/:slug').get(articles.getSingle)

	app.route('/portfolio').get(portfolio.listAll)
	app.route('/portfolio/:slug').get(portfolio.getSingle)

	app.route('/codes').get(codes.listAll)
	app.route('/codes/:slug').get(codes.getSingle)

	app.get('*', function (request, response) {
		response.status(404).send('There is no valid data here')
	})
}
