import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'
import metaMarked from 'meta-marked'
import Markdown from '../classes/Markdown.js'

/**
 * A caching service to read, parse, and store markdown content from the filesystem.
 * Content is loaded once at startup to avoid filesystem access on every request.
 */
class MarkdownContentService {
	#content = new Map()
	#isInitialized = false

	/**
	 * @param {string} contentPath The path to the directory containing markdown files.
	 * @param {Function} dataShapeFn A function to shape the parsed markdown data.
	 */
	constructor (contentPath, dataShapeFn) {
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
	 */
	async initialize () {
		if (this.#isInitialized) {
			console.log(`Content from ${this.contentPath} is already initialized.`)
			return
		}

		try {
			const files = await glob(`${this.contentPath}/*.md`)
			if (!files.length) {
				console.warn(`No markdown files found in ${this.contentPath}`)
				return
			}

			const allContent = await Promise.all(files.map(file => this.#processFile(file)))
			allContent.forEach(item => {
				if (item && item.slug) {
					this.#content.set(item.slug, item)
				}
			})

			this.#isInitialized = true
			console.log(`Successfully initialized ${this.#content.size} items from ${this.contentPath}`)
		}
		catch (error) {
			console.error(`Failed to initialize content from ${this.contentPath}:`, error)
			throw error // Re-throw to potentially stop the server from starting
		}
	}

	/**
	 * Processes a single markdown file.
	 * @param {string} filePath The full path to the file.
	 * @returns {Promise<Object|null>}
	 */
	async #processFile (filePath) {
		try {
			const fileContent = await fs.readFile(filePath, 'utf8')
			const marked = metaMarked(fileContent)

			// Extract the base file name without the extension to create a slug
			const baseName = path.basename(filePath, path.extname(filePath))
			marked.slug = baseName.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/^code-/, '')

			marked.markdown = marked.markdown || ''
			marked.html = Markdown.renderMarkdown(marked.markdown) || ''

			return this.dataShapeFn(marked)
		}
		catch (error) {
			console.error(`Error processing file ${filePath}:`, error)
			return null
		}
	}

	/**
	 * Retrieves all content from the cache.
	 * @returns {Array<Object>}
	 */
	getAll () {
		return Array.from(this.#content.values())
	}

	/**
	 * Retrieves a single item by its slug from the cache.
	 * @param {string} slug
	 * @returns {Object | undefined}
	 */
	findBySlug (slug) {
		return this.#content.get(slug)
	}
}

export default MarkdownContentService
