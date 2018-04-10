'use strict'

var fs = require('fs-extra')
var glob = require('glob')
var path = require('path')
var markdown = require('markdown-parse')

var folder = path.resolve('./../posts/projects')

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
			var post = fs.readFileSync(path.resolve(folder, file), 'utf8')

			markdown(post, function (error, result) {

				fileContent.unshift({
					'title': result.attributes.title,
					'slug': slugName(file),
					'image': result.attributes.image || '',
					'date': result.attributes.date || new Date(),
					'color': result.attributes.color || '',
					'publish': result.attributes.publish === false ? false : true
				})
			})
		})

		return response.json(fileContent)
	})
}

/**
 * Send a single post content by its filename
 */
exports.getSingle = function (request, response) {

	glob(folder + '/*' + request.params.slug + '.md', function (error, files) {
		var file = files[0]

		if (undefined === file) {
			return response.status(404).send('No data found')
		}

		fs.readFile(file, 'utf8', function (error, post) {
			if (error) return console.error(error)
			var fileContent = {}

			markdown(post, function (error, result) {
				fileContent.title = result.attributes.title
				fileContent.slug = request.params.slug
				fileContent.image = result.attributes.image || ''
				fileContent.date = result.attributes.date || new Date()
				fileContent.content = result.body
			})

			return response.json(fileContent)
		})
	})
}
