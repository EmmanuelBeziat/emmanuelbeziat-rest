'use strict'

var fs = require('fs-extra')
var path = require('path')
var markdown = require('markdown-parse')

var folder = path.resolve('./posts/articles')

exports.listAll = function (req, res) {
	var fileContent = []

	fs.readdir(path.resolve(folder), 'utf8', function (error, files) {
		if (error) throw error

		files.forEach(function (file) {
			var post = fs.readFileSync(path.resolve(folder, file), 'utf8')

			markdown(post, function (error, result) {

				fileContent.unshift({
					'title': result.attributes.title,
					'slug': file.replace(/\.[^/.]+$/, '').slice(11),
					'image': result.attributes.image || '',
					'date': result.attributes.date || new Date(),
					'tags': result.attributes.tags || [''],
					'categories': result.attributes.categories || ['non-classe'],
					'description': result.attributes.description || '',
					'disqus': result.attributes.disqus || true,
					'publish': result.attributes.publish || true
				})
			})
		})

		res.json(fileContent)
	})
}

exports.getSingle = function () {
	fs.readFile('/etc/passwd', 'utf8', function (error, data) {
		if (error) throw error

		console.log(data)
	})
}
