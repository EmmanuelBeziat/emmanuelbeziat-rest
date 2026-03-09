import fs from 'fs/promises'
import * as path from 'path'

class RSS {
	private folder: string

	constructor () {
		this.folder = process.env.RSS as string
	}

	async serveRSS (): Promise<string> {
		return fs.readFile(path.resolve(this.folder), 'utf8')
	}
}

export default RSS
