import ModelHandler from '../classes/ModelHandler.js'

class Portfolio extends ModelHandler {
	constructor () {
		super(process.env.VITE_PORTFOLIO)
	}

	/**
   * Reads the content of a marked file and returns its components
   * @param {Object} marked parsed marked files with metadata
   * @returns {Object}
   */
	readFileContent (marked) {
    return {
      title: marked.meta.title,
      slug: marked.slug,
      image: marked.meta.image || '',
			date: marked.meta.date || new Date(),
			tags: marked.meta.tags || [''],
			color: marked.meta.color || '',
			clients: marked.meta.clients || [''],
			categories: marked.meta.categories || ['non-classe'],
			description: marked.meta.description || '',
			markdown: marked.markdown || '',
			markup: marked.html || ''
    }
  }
}

export default new Portfolio()
