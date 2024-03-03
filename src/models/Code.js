import ModelHandler from '../classes/ModelHandler.js'

class Code extends ModelHandler {
	constructor () {
		super(process.env.CODES, 'code-')
	}

	/**
   * Reads the content of a marked file and returns its components
   * @param {Object} marked parsed marked files with metadata
   * @returns {Object}
   */
	readFileContent (marked) {
    return {
      slug: marked.slug,
      markdown: marked.markdown || '',
      markup: marked.html || ''
    }
  }
}

export default new Code()
