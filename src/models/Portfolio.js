import fs from 'fs'
import path from 'path'
import glob from 'glob'
import { sanitizeUrl } from '@braintree/sanitize-url'
import metaMarked from 'meta-marked'

class Portfolio {
	constructor () {
		this.folder = process.env.PORTFOLIO
	}

	/**
	 * slugName
	 * @param {string} fileName
	 * @returns string
	 */
	slugName (fileName) {
		return fileName.replace(/\.[^/.]+$/, '').slice(11)
	}

	/**
	 * list All posts in a single JSON string
	 */
	getAllPosts () {
		const fileContent = []

		return new Promise((resolve, reject) => {
			fs.readdir(path.resolve(this.folder), 'utf8', (error, files) => {
				if (error) {
					reject('No folder found.')
					return
				}

				files.forEach(file => {
					const post = fs.readFileSync(path.resolve(this.folder, file), 'utf8')
					const marked = metaMarked(post)

					fileContent.unshift({
						title: marked.meta.title,
						slug: this.slugName(file),
						image: marked.meta.image || '',
						date: marked.meta.date || new Date(),
						tags: marked.meta.tags || [''],
						clients: marked.meta.clients || [''],
						color: marked.meta.color || '',
						categories: marked.meta.categories || ['non-classe'],
						publish: marked.meta.publish === false ? false : true,
						content: marked.markdown || ''
					})
				})

				resolve(fileContent)
			})
		})
	}

	/**
	 * Send a single post content by its filename
	 */
	getPost (param, reply) {
		return new Promise((resolve, reject) => {
			const slug = this.sanitize(param)

			glob(`${this.folder}/*${slug}.md`, (error, files) => {
				if (!files.length || error) {
					reject('No data found.')
					return
				}

				fs.readFile(files[0], 'utf8', (error, file) => {
					if (error) {
						reject('No data found.')
						return
					}

					const post = {}
					const marked = metaMarked(file)

					post.title = marked.meta.title
					post.slug = slug
					post.image = marked.meta.image || ''
					post.date = marked.meta.date || new Date()
					post.tags = marked.meta.tags || ['']
					post.color = marked.meta.color || ''
					post.clients = marked.meta.clients || ['']
					post.categories = marked.meta.categories || ['non-classe']
					post.description = marked.meta.description || ''
					post.content = marked.markdown || ''

					resolve(post)
				})
			})
		})
	}

	sanitize (string) {
		return sanitizeUrl(string)
	}
}

export default new Portfolio()
