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
	}

	/**
	 * Exposes initialization so the application can deterministically await cache readiness
	 */
	async initialize (): Promise<void> {
		return this.service.initialize()
	}

	/**
	 * Retrieves all content from the cache.
	 * @returns {Promise<Array>} A promise that resolves with the content of all files.
	 */
	async getAllFiles (): Promise<any[]> {
		const allContent = this.service.getAll()
		if (!allContent.length) {
			throw new Error('No content found.')
		}
		return allContent
	}

	/**
	 * Retrieves a file from the cache based on its slug.
	 * Lookup is a Map key access (no filesystem path is built from the input),
	 * and the slug format is validated at the route layer.
	 * @param {string} slug The slug to search for.
	 * @returns {Promise<Object>} A promise that resolves with the content of the file.
	 */
	async getFile (slug: string): Promise<any> {
		const content = this.service.findBySlug(slug)
		if (!content) {
			throw new Error('No data found.')
		}
		return content
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
