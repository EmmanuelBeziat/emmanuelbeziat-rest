import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'
import matter from 'gray-matter'
import Markdown from '../classes/Markdown.js'
import type { MarkedFile } from '../types.js'
import { SLUG_PATTERN } from '../utils/schemas.js'

/**
 * Minimal logger, satisfied by `console` and Fastify's logger
 */
export type WarnLogger = { warn: (message: string) => void }

/**
 * Reads, parses and caches markdown content from a directory, loaded once at startup
 */
class MarkdownContentService<T extends { slug: string } = { slug: string }> {
	private content: Map<string, T> = new Map()
	private isInitialized = false
	private contentPath: string
	private dataShapeFn: (marked: MarkedFile) => T

	/**
	 * @param {string} contentPath The directory containing the markdown files
	 * @param {Function} dataShapeFn Shapes a parsed markdown file into a record
	 */
	constructor (contentPath: string, dataShapeFn: (marked: MarkedFile) => T) {
		if (!contentPath) {
			throw new Error('A content path must be provided.')
		}
		if (typeof dataShapeFn !== 'function') {
			throw new Error('A data shaping function must be provided.')
		}
		this.contentPath = contentPath
		this.dataShapeFn = dataShapeFn
	}

	/**
	 * Reads and parses every markdown file into the cache, does nothing once initialized
	 * @param {WarnLogger} log Logger for non-fatal problems, defaults to the console
	 * @throws {Error} Listing every file that fails to parse, has an invalid slug or a duplicate slug
	 */
	async initialize (log: WarnLogger = console): Promise<void> {
		if (this.isInitialized) {
			return
		}

		const stat = await fs.stat(this.contentPath).catch(() => {
			throw new Error(`Content path does not exist: ${this.contentPath}`)
		})
		if (!stat.isDirectory()) {
			throw new Error(`Content path is not a directory: ${this.contentPath}`)
		}

		const files = await glob(`${this.contentPath}/*.md`)
		if (!files.length) {
			log.warn(`No markdown files found in ${this.contentPath}`)
			this.isInitialized = true
			return
		}

		const results = await Promise.allSettled(files.map(file => this.processFile(file)))
		const problems: string[] = []
		const sources = new Map<string, string>()

		results.forEach((result, index) => {
			const file = files[index] as string
			if (result.status === 'rejected') {
				const reason = result.reason instanceof Error ? result.reason.message : String(result.reason)
				problems.push(`${file}: ${reason}`)
				return
			}

			const item = result.value
			if (!SLUG_PATTERN.test(item.slug)) {
				problems.push(`${file}: slug "${item.slug}" must match ${SLUG_PATTERN} (it would be unreachable)`)
				return
			}

			const existing = sources.get(item.slug)
			if (existing) {
				problems.push(`${file}: duplicate slug "${item.slug}" (already used by ${existing})`)
				return
			}

			sources.set(item.slug, file)
			this.content.set(item.slug, item)
		})

		if (problems.length) {
			this.content.clear()
			throw new Error(`Invalid content in ${this.contentPath}:\n- ${problems.join('\n- ')}`)
		}

		this.isInitialized = true
	}

	/**
	 * Reads, parses and shapes a single markdown file
	 * @param {string} filePath The full path to the file
	 * @returns {Promise<T>} The shaped record
	 */
	private async processFile (filePath: string): Promise<T> {
		const fileContent = await fs.readFile(filePath, 'utf8')
		const parsed = matter(fileContent)

		const baseName = path.basename(filePath, path.extname(filePath))
		const markdown = parsed.content || ''

		return this.dataShapeFn({
			meta: parsed.data,
			markdown,
			slug: baseName.replace(/^\d{4}-\d{2}-\d{2}-/, ''),
			html: Markdown.renderMarkdown(markdown) || ''
		})
	}

	/**
	 * @throws {Error} When the cache is read before `initialize()` completed
	 */
	private assertInitialized (): void {
		if (!this.isInitialized) {
			throw new Error(`Content from ${this.contentPath} was read before initialize() completed.`)
		}
	}

	/**
	 * Retrieves all items from the cache
	 * @returns {T[]} The items
	 */
	getAll (): T[] {
		this.assertInitialized()
		return Array.from(this.content.values())
	}

	/**
	 * Retrieves an item from the cache by its slug
	 * @param {string} slug The slug to search for
	 * @returns {T | undefined} The item, undefined when unknown
	 */
	findBySlug (slug: string): T | undefined {
		this.assertInitialized()
		return this.content.get(slug)
	}
}

export default MarkdownContentService
