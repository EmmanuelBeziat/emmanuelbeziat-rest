import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import { sanitizeUrl } from '@braintree/sanitize-url'
import metaMarked from 'meta-marked'
import Markdown from './Markdown.js'

/**
 * Default model
 */
class ModelHandler {
	/**
	 * Constructs the FileHandler with a specified folder and file prefix.
	 * @param {string} folder The folder containing the files.
	 * @param {string} filePrefix The prefix for file names.
	 */
	constructor (folder, filePrefix) {
		this.folder = folder
		this.filePrefix = filePrefix
	}

	/**
	 * slugName
	 * @param {string} fileName
	 * @returns string
	 */
	slugName (fileName) {
		// Extract the base file name without the extension
		const baseName = path.basename(fileName, path.extname(fileName))
		// Remove the date from the start of the filename (format: YYYY-MM-DD-)
		// and any potential file prefix
		const cleanedName = baseName.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/^code-/, '')
		return cleanedName
	}

	/**
	 * Sanitizes a string to prevent XSS attacks.
	 * @param {string} string The string to sanitize.
	 * @returns {string} The sanitized string.
	 */
	sanitize (string) {
		return sanitizeUrl(string)
	}

	/**
	 * Retrieves all files from the folder, reads their content, and returns it.
	 * @returns {Promise<Array>} A promise that resolves with the content of all files.
	 */
	getAllFiles () {
		return new Promise((resolve, reject) => {
			fs.readdir(path.resolve(this.folder), 'utf8', (error, files) => {

				if (error) reject('No folder found.')
				if (!files.length) reject('No files in folder')

				Promise.all(files.map(file => this.getFileContent(file)))
					.then(fileContents => { resolve(fileContents) })
					.catch(reject)
			})
		})
	}

	/**
	 * Retrieves a file based on a sanitized parameter and returns its content.
	 * @param {string} param The parameter to sanitize and use for file retrieval.
	 * @returns {Promise<Object>} A promise that resolves with the content of the file.
	 */
	async getFile (param) {
		const slug = this.sanitize(param)

		try {
			const files = await glob(`${this.folder}/*${slug}.md`)

			if (!files.length) {
				throw new Error('No data found.')
			}

			return await this.getFileContent(files[0])
		}
		catch (error) {
			throw new Error(`No data found. ${error.message}`)
		}
	}

	/**
	 * Reads the content of a file, parses it, and returns the parsed content.
	 * @param {string} fileName The name of the file to read.
	 * @returns {Promise<Object>} A promise that resolves with the parsed content of the file.
	 */
	getFileContent (fileName) {
		return new Promise((resolve, reject) => {
			fs.readFile(path.resolve(this.folder, fileName), 'utf8', (error, file) => {
				if (error) reject(error)

				const marked = metaMarked(file)
				marked.slug = this.slugName(fileName)
				marked.markdown = marked.markdown || ''
				marked.html = Markdown.renderMarkdown(marked.markdown) || ''

				resolve(this.readFileContent(marked))
			})
		})
	}

	/**
	 * Placeholder for processing the read file content. Should be implemented by subclasses.
	 * @param {Object} marked The parsed markdown file content.
	 * @throws {Error} Throw an error if the method is not overrided within a subclass.
	 */
	readFileContent (_marked) {
		throw new Error('Not implemented.')
	}
}

export default ModelHandler
