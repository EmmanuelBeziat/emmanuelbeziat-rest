import Post from '../models/Post'
import { createResourceRoutes, byDateDesc } from '../utils/resource'

const PostItemSchema = {
	type: 'object',
	properties: {
		title: { type: 'string' },
		slug: { type: 'string' },
		image: { type: 'string' },
		date: { anyOf: [{ type: 'string' }, { type: 'number' }] },
		tags: { type: 'array', items: { type: 'string' } },
		categories: { type: 'array', items: { type: 'string' } },
		description: { type: 'string' },
		publish: { type: 'boolean' },
		markdown: { type: 'string' },
		markup: { type: 'string' },
	},
	required: ['slug']
}

/**
 * Routes for the Post resource: newest first.
 */
export default createResourceRoutes({
	basePath: 'posts',
	model: Post,
	itemSchema: PostItemSchema,
	transform: byDateDesc
})
