import fs from 'fs'
import path from 'path'

class RSS {
	constructor () {
		this.folder = process.env.RSS
	}

	serveRSS () {
		return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(this.folder), 'utf8', (error, file) => {
        if (error) reject(error)

        resolve(file)
      })
    })
	}
}

export default RSS
