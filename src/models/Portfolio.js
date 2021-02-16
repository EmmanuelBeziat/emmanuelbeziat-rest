import fs from 'fs'
import path from 'path'
import glob from 'glob'
import { sanitizeUrl } from '@braintree/sanitize-url'
import metaMarked from 'meta-marked'
import Markdown from '../classes/Markdown.js'

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
					const html = Markdown.renderMarkdown(marked.markdown)

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
						markdown: marked.markdown || '',
						markup: html || ''
					})
				})

				resolve(fileContent)
			})
		})
	}

	/**
	 * Send a single post content by its filename
	 */
	getPost (param, options) {
		return new Promise((resolve, reject) => {
			const slug = this.sanitize(param)

			const queries = {
				markup: options.type == undefined ? true :options.type.split(',').includes('markup') ? true : false,
				markdown: options.type == undefined ? false : options.type.split(',').includes('markdown') ? true : false
			}

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
					const html = Markdown.renderMarkdown(marked.markdown)

					post.title = marked.meta.title
					post.slug = slug
					post.image = marked.meta.image || ''
					post.date = marked.meta.date || new Date()
					post.tags = marked.meta.tags || ['']
					post.color = marked.meta.color || ''
					post.clients = marked.meta.clients || ['']
					post.categories = marked.meta.categories || ['non-classe']
					post.description = marked.meta.description || ''
					if (queries.markdown) {
						post.markdown = marked.markdown || ''
					}
					if (queries.markup) {
						post.markup = html || ''
					}

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
