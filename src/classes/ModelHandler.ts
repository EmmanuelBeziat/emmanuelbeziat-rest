import MarkdownContentService, { type WarnLogger } from '../services/MarkdownContentService.js'
import { NotFoundError } from './NotFoundError.js'
import type { MarkedFile } from '../types.js'

/**
 * Base model backed by a cached content service, subclasses define the JSON shape
 */
abstract class ModelHandler<T extends { slug: string } = { slug: string }> {
	protected service: MarkdownContentService<T>

	/**
	 * @param {string} folder The folder containing the markdown files
	 */
	constructor (folder: string) {
		this.service = new MarkdownContentService<T>(folder, this.readFileContent.bind(this))
	}

	/**
	 * Loads the content into the cache
	 * @param {WarnLogger} log Logger for non-fatal problems, defaults to the console
	 */
	async initialize (log?: WarnLogger): Promise<void> {
		return this.service.initialize(log)
	}

	/**
	 * Retrieves all visible items from the cache
	 * @returns {T[]} The visible items, empty when the folder is empty
	 */
	getAllFiles (): T[] {
		return this.service.getAll().filter(item => this.isVisible(item))
	}

	/**
	 * Retrieves a visible item from the cache by its slug
	 * @param {string} slug The slug to search for
	 * @returns {T} The item
	 * @throws {NotFoundError} When the slug is unknown or the item is hidden
	 */
	getFile (slug: string): T {
		const content = this.service.findBySlug(slug)
		if (!content || !this.isVisible(content)) {
			throw new NotFoundError('No data found.')
		}
		return content
	}

	/**
	 * Whether an item may be served, hidden items behave as if they did not exist
	 * @param {T} _item The cached item
	 * @returns {boolean} True when the item is served
	 */
	protected isVisible (_item: T): boolean {
		return true
	}

	/**
	 * Shapes a parsed markdown file into the resource's JSON record
	 * @param {MarkedFile} marked The parsed markdown file
	 * @returns {T} The record
	 */
	abstract readFileContent (marked: MarkedFile): T
}

export default ModelHandler
