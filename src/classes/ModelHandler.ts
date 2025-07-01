import { sanitizeUrl } from '@braintree/sanitize-url'
import MarkdownContentService from '../services/MarkdownContentService.js'
import { MarkedFile } from '../types.js'

/**
 * Default model using a cached content service.
 */
class ModelHandler {
	protected folder: string
	protected service: MarkdownContentService

	/**
	 * Constructs the ModelHandler with a specified folder.
	 * @param {string} folder The folder containing the files.
	 */
	constructor (folder: string) {
		this.folder = folder
		this.service = new MarkdownContentService(folder, this.readFileContent.bind(this))
		this.service.initialize().catch(error => {
			console.error(`Failed to initialize model for ${folder}:`, error)
			// Depending on the desired behavior, you might want to exit the process
			// process.exit(1)
		})
	}

	/**
	 * Sanitizes a string to prevent XSS attacks.
	 * @param {string} string The string to sanitize.
	 * @returns {string} The sanitized string.
	 */
	sanitize (string: string): string {
		return sanitizeUrl(string)
	}

	/**
	 * Retrieves all content from the cache.
	 * @returns {Promise<Array>} A promise that resolves with the content of all files.
	 */
	getAllFiles (): Promise<any[]> {
		return new Promise((resolve, reject) => {
			const allContent = this.service.getAll()
			if (!allContent.length) {
				// This might happen if initialization is not complete or the folder is empty.
				// We'll wait a bit and retry once, in case initialization is in progress.
				setTimeout(() => {
					const allContentRetry = this.service.getAll()
					if (!allContentRetry.length) {
						reject(new Error('No content found.'))
					}
					else {
						resolve(allContentRetry)
					}
				}, 500)
			}
			else {
				resolve(allContent)
			}
		})
	}

	/**
	 * Retrieves a file from the cache based on its slug.
	 * @param {string} param The slug to search for.
	 * @returns {Promise<Object>} A promise that resolves with the content of the file.
	 */
	getFile (param: string): Promise<any> {
		return new Promise((resolve, reject) => {
			const slug = this.sanitize(param)
			const content = this.service.findBySlug(slug)

			if (content) {
				resolve(content)
			}
			else {
				reject(new Error('No data found.'))
			}
		})
	}

	/**
	 * Placeholder for processing the read file content. Should be implemented by subclasses.
	 * @param {MarkedFile} marked The parsed markdown file content.
	 * @throws {Error} Throw an error if the method is not implemented in a subclass.
	 */
	readFileContent (_marked: MarkedFile): any {
		throw new Error('readFileContent must be implemented in a subclass.')
	}
}

export default ModelHandler
