import ModelHandler from '../classes/ModelHandler.js'
import { config } from '../config.js'
import { requireTitle, requireDate, optionalString, optionalStringList } from '../utils/meta.js'
import type { MarkedFile, PortfolioData } from '../types.js'

/**
 * Portfolio entries
 */
class Portfolio extends ModelHandler<PortfolioData> {
	constructor () {
		super(config.content.portfolio)
	}

	/**
	 * Shapes a parsed markdown file into a portfolio record
	 * @param {MarkedFile} marked The parsed markdown file
	 * @returns {PortfolioData} The record
	 */
	override readFileContent (marked: MarkedFile): PortfolioData {
		return {
			title: requireTitle(marked),
			slug: marked.slug,
			image: optionalString(marked, 'image'),
			date: requireDate(marked),
			tags: optionalStringList(marked, 'tags'),
			color: optionalString(marked, 'color'),
			clients: optionalStringList(marked, 'clients'),
			categories: optionalStringList(marked, 'categories', ['non-classe']),
			description: optionalString(marked, 'description'),
			markdown: marked.markdown,
			markup: marked.html
		}
	}
}

export default new Portfolio()
