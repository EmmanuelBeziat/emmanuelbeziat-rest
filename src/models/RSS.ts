import fs from 'node:fs/promises'
import { config } from '../config.js'

/**
 * Blog RSS feed, read from disk on each request
 */
class RSS {
	private file: string

	constructor () {
		this.file = config.content.rss
	}

	/**
	 * Reads the feed file
	 * @returns {Promise<string>} The feed XML
	 */
	async serveRSS (): Promise<string> {
		return fs.readFile(this.file, 'utf8')
	}
}

export default new RSS()
