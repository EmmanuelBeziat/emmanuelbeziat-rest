import ModelHandler from '../classes/ModelHandler.js'
import { config } from '../config.js'
import { requireTitle, requireDate } from '../utils/meta.js'
import { MarkedFile, PortfolioData } from '../types.js'

class Portfolio extends ModelHandler<PortfolioData> {
	constructor () {
		super(config.content.portfolio)
	}

	/**
	 * Reads the content of a marked file and returns its components
	 * @param {MarkedFile} marked parsed marked files with metadata
	 * @returns {PortfolioData}
	 */
	readFileContent (marked: MarkedFile): PortfolioData {
		return {
			title: requireTitle(marked),
			slug: marked.slug,
			image: marked.meta.image || '',
			date: requireDate(marked),
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
