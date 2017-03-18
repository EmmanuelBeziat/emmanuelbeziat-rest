'use strict'

module.exports = function (app) {
	var articles = require('../controllers/articlesController.js')
	var portfolio = require('../controllers/portfolioController.js')

	// Posts routes
	app.route('/posts').get(articles.listAll)
	app.route('/posts/:slug').get(articles.getSingle)

	app.route('/portfolio').get(portfolio.listAll)
	app.route('/portfolio/:slug').get(portfolio.getSingle)
}