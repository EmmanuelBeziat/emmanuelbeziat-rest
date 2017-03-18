'use strict'

var fs = require('fs-extra')
// var glob = require('glob-fs')({ gitignore: true })
var glob = require('glob')
var path = require('path')
var markdown = require('markdown-parse')

var folder = path.resolve('./posts/articles')

/**
 * slugName
 * @param {string} fileName
 * @param {boolean} [path=false]
 * @returns string
 */
function slugName (fileName) {
	return fileName.replace(/\.[^/.]+$/, '').slice(11)
}

/**
 * list All posts in a single JSON string
 */
exports.listAll = function (request, response) {
	var fileContent = []

	fs.readdir(path.resolve(folder), 'utf8', function (error, files) {
		if (error) throw error

		files.forEach(function (file) {
			var post = fs.readFile(path.resolve(folder, file), 'utf8')

			markdown(post, function (error, result) {

				fileContent.unshift({
					'title': result.attributes.title,
					'slug': slugName(file, true),
					'date': result.attributes.date || new Date(),
					'tags': result.attributes.tags || [''],
					'categories': result.attributes.categories || ['non-classe'],
					'description': result.attributes.description || '',
					'publish': result.attributes.publish || true
				})
			})
		})

		response.json(fileContent)
	})
}

/**
 * Send a single post content by its filename
 */
exports.getSingle = function (request, response) {

	glob(folder + '/*' + request.params.slug + '.md', function (err, files) {
		var file = files[0]
		fs.readFile(file, 'utf8', function (error, post) {
			if (error) return console.error(error)
			var fileContent = {}

			markdown(post, function (error, result) {
				fileContent.title = result.attributes.title
				fileContent.slug = slugName(file)
				fileContent.image = result.attributes.image || ''
				fileContent.date = result.attributes.date || new Date()
				fileContent.tags = result.attributes.tags || ['']
				fileContent.categories = result.attributes.categories || ['non-classe']
				fileContent.description = result.attributes.description || ''
				fileContent.disqus = result.attributes.disqus || true
				fileContent.content = result.body
			})

			response.json(fileContent)
		})
	})
}
