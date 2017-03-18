'use strict'

module.exports = function (app) {
	var posts = require('../controllers/postsController.js')

	// Posts routes
	app.route('/posts').get(posts.listAllPosts)
	app.route('/posts/:slug').get(posts.getSinglePost)
}