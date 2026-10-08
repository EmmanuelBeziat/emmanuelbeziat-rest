import ModelHandler from '../classes/ModelHandler.js'
import { config } from '../config.js'
import { requireTitle, requireDate, optionalString, optionalStringList, optionalBoolean } from '../utils/meta.js'
import type { MarkedFile, PostData } from '../types.js'

class Post extends ModelHandler<PostData> {
	constructor () {
		super(config.content.posts)
	}

	/**
	 * Reads the content of a marked file and returns its components
	 * @param {MarkedFile} marked parsed marked files with metadata
	 * @returns {PostData}
	 */
	override readFileContent (marked: MarkedFile): PostData {
		return {
			title: requireTitle(marked),
			slug: marked.slug,
			image: optionalString(marked, 'image'),
			date: requireDate(marked),
			tags: optionalStringList(marked, 'tags'),
			categories: optionalStringList(marked, 'categories', ['non-classe']),
			description: optionalString(marked, 'description'),
			publish: optionalBoolean(marked, 'publish', true),
			markdown: marked.markdown,
			markup: marked.html
		}
	}

	/**
	 * Drafts (`publish: false`) are still loaded and validated, but never served.
	 */
	protected override isVisible (item: PostData): boolean {
		return item.publish
	}
}

export default new Post()
