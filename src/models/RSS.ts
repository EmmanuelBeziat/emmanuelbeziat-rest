import fs from 'node:fs/promises'
import { config } from '../config.js'

class RSS {
	private file: string

	constructor () {
		this.file = config.content.rss
	}

	async serveRSS (): Promise<string> {
		return fs.readFile(this.file, 'utf8')
	}
}

export default new RSS()
