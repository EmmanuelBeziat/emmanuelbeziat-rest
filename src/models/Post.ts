import ModelHandler from '../classes/ModelHandler.js'
import { config } from '../config.js'
import { requireTitle, requireDate, optionalString, optionalStringList, optionalBoolean } from '../utils/meta.js'
import type { MarkedFile, PostData } from '../types.js'

/**
 * Blog posts
 */
class Post extends ModelHandler<PostData> {
	constructor () {
		super(config.content.posts)
	}

	/**
	 * Shapes a parsed markdown file into a post record
	 * @param {MarkedFile} marked The parsed markdown file
	 * @returns {PostData} The record
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
	 * Hides drafts (`publish: false`)
	 * @param {PostData} item The cached post
	 * @returns {boolean} True when the post is published
	 */
	protected override isVisible (item: PostData): boolean {
		return item.publish
	}
}

export default new Post()
