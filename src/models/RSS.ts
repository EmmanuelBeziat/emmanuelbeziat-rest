import fs from 'fs/promises'
import * as path from 'path'
import { config } from '../config.js'

class RSS {
	private folder: string

	constructor () {
		this.folder = config.content.rss
	}

	async serveRSS (): Promise<string> {
		return fs.readFile(path.resolve(this.folder), 'utf8')
	}
}

export default new RSS()
