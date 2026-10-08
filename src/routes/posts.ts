import Post from '../models/Post.js'
import { PostSchema } from '../utils/schemas.js'
import { createResourceRoutes, byDateDesc } from '../utils/resource.js'

/**
 * Routes for the Post resource: newest first.
 */
export default createResourceRoutes({
	basePath: 'posts',
	model: Post,
	itemSchema: PostSchema,
	transform: byDateDesc
})
