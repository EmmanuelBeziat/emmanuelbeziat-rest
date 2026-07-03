import ModelHandler from '../classes/ModelHandler.js'
import { config } from '../config.js'
import { MarkedFile, CodeData } from '../types.js'

class Code extends ModelHandler<CodeData> {
	constructor () {
		super(config.content.codes)
	}

	/**
	 * Reads the content of a marked file and returns its components
	 * @param {MarkedFile} marked parsed marked files with metadata
	 * @returns {CodeData}
	 */
	readFileContent (marked: MarkedFile): CodeData {
		return {
			slug: marked.slug.replace(/^code-/, ''),
			markdown: marked.markdown || '',
			markup: marked.html || ''
		}
	}
}

export default new Code()
