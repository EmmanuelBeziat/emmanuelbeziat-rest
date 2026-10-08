import Post from '../models/Post.js'
import { PostSchema, PostListSchema } from '../utils/schemas.js'
import { createResourceRoutes, byDateDesc } from '../utils/resource.js'

/**
 * Routes for the Post resource, newest first
 */
export default createResourceRoutes({
	basePath: 'posts',
	model: Post,
	itemSchema: PostSchema,
	listItemSchema: PostListSchema,
	transform: byDateDesc
})
