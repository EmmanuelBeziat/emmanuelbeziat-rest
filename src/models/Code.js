import fs from 'fs'
import path from 'path'
import glob from 'glob'
import { sanitizeUrl } from '@braintree/sanitize-url'
import metaMarked from 'meta-marked'
import Markdown from '../classes/Markdown.js'

class Code {
	constructor () {
		this.folder = process.env.CODES
	}

	/**
	 * slugName
	 * @param {string} fileName
	 * @returns string
	 */
	slugName (fileName) {
		return fileName.replace(/\.[^/.]+$/, '')
	}

	/**
	 * list All codes in a single JSON string
	 */
	getAllCodes () {
		const fileContent = []

		return new Promise((resolve, reject) => {
			fs.readdir(path.resolve(this.folder), 'utf8', (error, files) => {
				if (error) {
					reject('No folder found.')
					return
				}

				if (!files.length) {
					reject('No files in folder')
					return
				}

				files?.forEach(file => {
					const code = fs.readFileSync(path.resolve(this.folder, file), 'utf8')
					const marked = metaMarked(code)
					const html = Markdown.renderMarkdown(marked.markdown)

					fileContent.unshift({
						slug: `code-${this.slugName(file)}`,
						markdown: marked.markdown || '',
						markup: html || ''
					})
				})

				resolve(fileContent)
			})
		})
	}

	/**
	 * Send a single code content by its filename
	 */
	getCode (param, options) {
		return new Promise((resolve, reject) => {
			const slug = this.sanitize(param)

			const queries = {
				markup: options.type == undefined ? true :options.type.split(',').includes('markup') ? true : false,
				markdown: options.type == undefined ? false : options.type.split(',').includes('markdown') ? true : false
			}

			glob(`${this.folder}/*${slug}.md`, (error, files) => {
				if (!files.length || error) {
					reject(`No data found.`)
					return
				}

				fs.readFile(files[0], 'utf8', (error, file) => {
					if (error) {
						reject('No data found.')
						return
					}

					const code = {}
					const marked = metaMarked(file)
					const html = Markdown.renderMarkdown(marked.markdown)

					code.slug = slug
					if (queries.markdown) {
						code.markdown = marked.markdown || ''
					}
					if (queries.markup) {
						code.markup = html || ''
					}

					resolve(code)
				})
			})
		})
	}

	sanitize (string) {
		return sanitizeUrl(string)
	}
}

export default new Code()
