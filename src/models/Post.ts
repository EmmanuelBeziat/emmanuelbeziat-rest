import ModelHandler from '../classes/ModelHandler.js'
import { config } from '../config.js'
import { requireTitle, requireDate } from '../utils/meta.js'
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
			title: requireTitle(marked),
			slug: marked.slug,
			image: marked.meta.image || '',
			date: requireDate(marked),
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
