import * as fs from 'fs'
import * as path from 'path'

class RSS {
	private folder: string

	constructor () {
		this.folder = process.env.RSS as string
	}

	serveRSS (): Promise<string> {
		return new Promise((resolve, reject) => {
			fs.readFile(path.resolve(this.folder), 'utf8', (error, file) => {
				if (error) reject(error)

				resolve(file)
			})
		})
	}
}

export default RSS
