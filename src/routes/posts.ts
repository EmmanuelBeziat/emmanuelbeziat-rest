import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import Post from '../models/Post.js'

/**
 * Encapsulates the routes for the Post resource.
 * @param {FastifyInstance} fastify - The Fastify instance.
 */
async function postRoutes (fastify: FastifyInstance) {
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

	fastify.get('/posts', { schema: { response: { 200: { type: 'array', items: PostItemSchema } } } }, async (_request: FastifyRequest, reply: FastifyReply) => {
		try {
			const data = await Post.getAllFiles()
			const sortedData = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			reply.send(sortedData)
		}
		catch (err) {
			reply.code(404).send({
				statusCode: 404,
				error: 'Not Found',
				message: err instanceof Error ? err.message : 'Resource not found'
			})
		}
	})

	fastify.get('/posts/:slug', { schema: { params: { type: 'object', properties: { slug: { type: 'string', pattern: '^[a-z0-9-]+$' } }, required: ['slug'] }, response: { 200: PostItemSchema } } }, async (request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) => {
		try {
			const data = await Post.getFile(request.params.slug)
			reply.send(data)
		}
		catch (err) {
			reply.code(404).send({
				statusCode: 404,
				error: 'Not Found',
				message: err instanceof Error ? err.message : 'Resource not found'
			})
		}
	})
}

export default postRoutes
