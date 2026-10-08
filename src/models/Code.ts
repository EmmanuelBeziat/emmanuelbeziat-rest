import ModelHandler from '../classes/ModelHandler.js'
import { config } from '../config.js'
import type { MarkedFile, CodeData } from '../types.js'

/**
 * Code snippets
 */
class Code extends ModelHandler<CodeData> {
	constructor () {
		super(config.content.codes)
	}

	/**
	 * Shapes a parsed markdown file into a code record
	 * @param {MarkedFile} marked The parsed markdown file
	 * @returns {CodeData} The record
	 */
	override readFileContent (marked: MarkedFile): CodeData {
		return {
			slug: marked.slug.replace(/^code-/, ''),
			markdown: marked.markdown,
			markup: marked.html
		}
	}
}

export default new Code()
