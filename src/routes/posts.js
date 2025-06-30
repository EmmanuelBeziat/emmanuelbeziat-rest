import Post from '../models/Post.js'

/**
 * Encapsulates the routes for the Post resource.
 * @param {import('fastify').FastifyInstance} fastify - The Fastify instance.
 */
async function postRoutes (fastify) {
	fastify.get('/posts', async (_request, reply) => {
		try {
			const data = await Post.getAllFiles()
			reply.send(data.reverse())
		}
		catch (err) {
			reply.code(404).send(err)
		}
	})

	fastify.get('/posts/:slug', async (request, reply) => {
		try {
			const data = await Post.getFile(request.params.slug)
			reply.send(data)
		}
		catch (err) {
			reply.code(404).send(err)
		}
	})
}

export default postRoutes
