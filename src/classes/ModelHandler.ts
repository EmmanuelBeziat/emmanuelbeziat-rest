import MarkdownContentService from '../services/MarkdownContentService.js'
import { NotFoundError } from './NotFoundError.js'
import { MarkedFile } from '../types.js'

/**
 * Base model using a cached content service. Subclasses define the JSON shape.
 */
abstract class ModelHandler<T extends { slug: string } = { slug: string }> {
	protected folder: string
	protected service: MarkdownContentService<T>

	/**
	 * Constructs the ModelHandler with a specified folder.
	 * @param {string} folder The folder containing the files.
	 */
	constructor (folder: string) {
		this.folder = folder
		this.service = new MarkdownContentService<T>(folder, this.readFileContent.bind(this))
	}

	/**
	 * Exposes initialization so the application can deterministically await cache readiness
	 */
	async initialize (): Promise<void> {
		return this.service.initialize()
	}

	/**
	 * Retrieves all content from the cache. Resolves to an empty array when the content folder is legitimately empty.
	 * @returns {Promise<Array>} A promise that resolves with the content of all files.
	 */
	async getAllFiles (): Promise<T[]> {
		return this.service.getAll()
	}

	/**
	 * Retrieves a file from the cache based on its slug.
	 * Lookup is a Map key access (no filesystem path is built from the input), and the slug format is validated at the route layer.
	 * @param {string} slug The slug to search for.
	 * @returns {Promise<Object>} A promise that resolves with the content of the file.
	 */
	async getFile (slug: string): Promise<T> {
		const content = this.service.findBySlug(slug)
		if (!content) {
			throw new NotFoundError('No data found.')
		}
		return content
	}

	/**
	 * Shapes a parsed markdown file into the resource's JSON record.
	 * @param {MarkedFile} marked The parsed markdown file content.
	 */
	abstract readFileContent (marked: MarkedFile): T
}

export default ModelHandler
