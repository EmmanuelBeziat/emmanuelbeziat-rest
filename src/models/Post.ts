import ModelHandler from '../classes/ModelHandler.js'
import { MarkedFile } from '../types.js'

class Post extends ModelHandler {
	constructor () {
		super(process.env.POSTS as string)
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
			categories: marked.meta.categories || ['non-classe'],
			description: marked.meta.description || '',
			publish: marked.meta.publish === false ? false : true,
			markdown: marked.markdown || '',
			markup: marked.html || ''
		}
	}
}

export default new Post()
