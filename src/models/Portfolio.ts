import ModelHandler from '../classes/ModelHandler.js'
import { MarkedFile } from '../types.js'

class Portfolio extends ModelHandler {
	constructor () {
		super(process.env.PORTFOLIO as string)
	}

	/**
	 * Reads the content of a marked file and returns its components
	 * @param {MarkedFile} marked parsed marked files with metadata
	 * @returns {Object}
	 */
	readFileContent (marked: MarkedFile) {
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
