import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

class RSS {
	constructor () {
		this.folder = process.env.RSS
	}

	serveRSS (reply) {
		return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(this.folder), 'utf8', (error, file) => {
        if (error) reject(error)

        resolve(file)
      })
    })
	}
}

export default RSS
