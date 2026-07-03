import ModelHandler from '../classes/ModelHandler.js'
import { config } from '../config.js'
import { MarkedFile, PostData } from '../types.js'

class Post extends ModelHandler<PostData> {
	constructor () {
		super(config.content.posts)
	}

	/**
	 * Reads the content of a marked file and returns its components
	 * @param {MarkedFile} marked parsed marked files with metadata
	 * @returns {PostData}
	 */
	readFileContent (marked: MarkedFile): PostData {
		return {
			title: marked.meta.title,
			slug: marked.slug,
			image: marked.meta.image || '',
			date: marked.meta.date || new Date(),
			tags: marked.meta.tags || [''],
			categories: marked.meta.categories || ['non-classe'],
			description: marked.meta.description || '',
			publish: marked.meta.publish !== false,
			markdown: marked.markdown || '',
			markup: marked.html || ''
		}
	}
}

export default new Post()
