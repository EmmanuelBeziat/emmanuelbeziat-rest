'use strict'

var fs = require('fs-extra')
var glob = require('glob')
var path = require('path')
var markdown = require('markdown-parse')

var folder = path.resolve('./../posts/codes')

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
		if (error) {
			return response.status(500).send(`No folder found. ${error}`)
		}

		files.forEach(function (file) {
			var post = fs.readFileSync(path.resolve(folder, file), 'utf8')

			markdown(post, function (error, result) {

				fileContent.unshift({
					'slug': slugName(file),
					'content': result.body
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
			if (error) {
				return response.status(500).send(`No data found. ${error}`)
			}
			var fileContent = {}

			markdown(post, function (error, result) {
				fileContent.slug = request.params.slug
				fileContent.content = result.body
			})

			return response.json(fileContent)
		})
	})
}
