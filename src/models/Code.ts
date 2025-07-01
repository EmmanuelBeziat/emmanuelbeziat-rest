import ModelHandler from '../classes/ModelHandler.js'
import { MarkedFile } from '../types.js'

class Code extends ModelHandler {
	constructor () {
		super(process.env.CODES as string)
	}

	/**
	 * Reads the content of a marked file and returns its components
	 * @param {MarkedFile} marked parsed marked files with metadata
	 * @returns {Object}
	 */
	readFileContent (marked: MarkedFile) {
		return {
			slug: marked.slug,
			markdown: marked.markdown || '',
			markup: marked.html || ''
		}
	}
}

export default new Code()
