import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import Post from '../models/Post.js'

/**
 * Encapsulates the routes for the Post resource.
 * @param {FastifyInstance} fastify - The Fastify instance.
 */
async function postRoutes (fastify: FastifyInstance) {
	fastify.get('/posts', async (_request: FastifyRequest, reply: FastifyReply) => {
		try {
			const data = await Post.getAllFiles()
			const sortedData = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			reply.send(sortedData)
		}
		catch (err) {
			reply.code(404).send(err)
		}
	})

	fastify.get('/posts/:slug', async (request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) => {
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
