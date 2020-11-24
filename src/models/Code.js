import fs from 'fs'
import path from 'path'
import glob from 'glob'
import { sanitizeUrl } from '@braintree/sanitize-url'
import metaMarked from 'meta-marked'

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

				files.forEach(file => {
					const code = fs.readFileSync(path.resolve(this.folder, file), 'utf8')
					const marked = metaMarked(code)

					fileContent.unshift({
						slug: `code-${this.slugName(file)}`,
						content: marked.markdown || ''
					})
				})

				resolve(fileContent)
			})
		})
	}

	/**
	 * Send a single code content by its filename
	 */
	getCode (param, reply) {
		return new Promise((resolve, reject) => {
			const slug = this.sanitize(param)

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

					code.slug = slug
					code.content = marked.markdown || ''

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
