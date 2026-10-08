import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'
import matter from 'gray-matter'
import Markdown from '../classes/Markdown.js'
import type { MarkedFile } from '../types.js'
import { SLUG_PATTERN } from '../utils/schemas.js'

// The one logger method the service needs, satisfied by both `console` and Fastify's pino logger.
export type WarnLogger = { warn: (message: string) => void }

/**
 * A caching service to read, parse, and store markdown content from the filesystem.
 * Content is loaded once at startup to avoid filesystem access on every request.
 */
class MarkdownContentService<T extends { slug: string } = { slug: string }> {
	private content: Map<string, T> = new Map()
	private isInitialized = false
	private contentPath: string
	private dataShapeFn: (marked: MarkedFile) => T

	/**
	 * @param {string} contentPath The path to the directory containing markdown files.
	 * @param {Function} dataShapeFn A function to shape the parsed markdown data.
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
	 * Initializes the cache by reading and parsing all markdown files.
	 * This method should be called once at application startup.
	 *
	 * Every file must load: a file that fails to parse, yields a slug the routes cannot match, or collides with another file's slug fails startup with the full list of problems, instead of silently disappearing.
	 * @param {WarnLogger} log Where to report non-fatal problems (defaults to the console).
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
	 * Processes a single markdown file. Errors propagate to `initialize`.
	 * @param {string} filePath The full path to the file.
	 * @returns {Promise<Object>}
	 */
	private async processFile (filePath: string): Promise<T> {
		const fileContent = await fs.readFile(filePath, 'utf8')
		const parsed = matter(fileContent)

		// Extract the base file name without the extension to create a slug
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
	 * Throws if the cache is read before `initialize()` completed, so an early read can never be mistaken for (and memoized as) empty content.
	 */
	private assertInitialized (): void {
		if (!this.isInitialized) {
			throw new Error(`Content from ${this.contentPath} was read before initialize() completed.`)
		}
	}

	/**
	 * Retrieves all content from the cache.
	 * @returns {Array<Object>}
	 */
	getAll (): T[] {
		this.assertInitialized()
		return Array.from(this.content.values())
	}

	/**
	 * Retrieves a single item by its slug from the cache.
	 * @param {string} slug
	 * @returns {Object | undefined}
	 */
	findBySlug (slug: string): T | undefined {
		this.assertInitialized()
		return this.content.get(slug)
	}
}

export default MarkdownContentService
