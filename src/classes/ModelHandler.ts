import MarkdownContentService, { type WarnLogger } from '../services/MarkdownContentService.js'
import { NotFoundError } from './NotFoundError.js'
import type { MarkedFile } from '../types.js'

/**
 * Base model using a cached content service. Subclasses define the JSON shape.
 */
abstract class ModelHandler<T extends { slug: string } = { slug: string }> {
	protected service: MarkdownContentService<T>

	/**
	 * Constructs the ModelHandler with a specified folder.
	 * @param {string} folder The folder containing the files.
	 */
	constructor (folder: string) {
		this.service = new MarkdownContentService<T>(folder, this.readFileContent.bind(this))
	}

	/**
	 * Exposes initialization so the application can deterministically await cache readiness
	 * @param {WarnLogger} log Where to report non-fatal problems (defaults to the console).
	 */
	async initialize (log?: WarnLogger): Promise<void> {
		return this.service.initialize(log)
	}

	/**
	 * Retrieves all visible content from the cache. Returns an empty array when the content folder is legitimately empty.
	 * @returns {Array} The content of all visible files.
	 */
	getAllFiles (): T[] {
		return this.service.getAll().filter(item => this.isVisible(item))
	}

	/**
	 * Retrieves a visible file from the cache based on its slug.
	 * Lookup is a Map key access (no filesystem path is built from the input), and the slug format is validated at the route layer.
	 * @param {string} slug The slug to search for.
	 * @returns {Object} The content of the file.
	 */
	getFile (slug: string): T {
		const content = this.service.findBySlug(slug)
		if (!content || !this.isVisible(content)) {
			throw new NotFoundError('No data found.')
		}
		return content
	}

	/**
	 * Whether an item may be served. Hidden items are still loaded (and validated) but behave as if they did not exist.
	 * @param {T} _item The cached item.
	 */
	protected isVisible (_item: T): boolean {
		return true
	}

	/**
	 * Shapes a parsed markdown file into the resource's JSON record.
	 * @param {MarkedFile} marked The parsed markdown file content.
	 */
	abstract readFileContent (marked: MarkedFile): T
}

export default ModelHandler
