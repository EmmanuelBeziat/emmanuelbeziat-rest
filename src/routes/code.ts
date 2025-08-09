import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import Code from '../models/Code.js'

/**
 * Encapsulates the routes for the Code resource.
 * @param {FastifyInstance} fastify - The Fastify instance.
 */
async function codeRoutes (fastify: FastifyInstance) {
	const CodeItemSchema = {
		type: 'object',
		properties: {
			slug: { type: 'string' },
			markdown: { type: 'string' },
			markup: { type: 'string' },
		},
		required: ['slug']
	}

	fastify.get('/codes', { schema: { response: { 200: { type: 'array', items: CodeItemSchema } } } }, async (_request: FastifyRequest, reply: FastifyReply) => {
		try {
			const data = await Code.getAllFiles()
			reply.send(data.reverse())
		}
		catch (err) {
			reply.code(404).send(err)
		}
	})

	fastify.get('/codes/:slug', { schema: { params: { type: 'object', properties: { slug: { type: 'string' } }, required: ['slug'] }, response: { 200: CodeItemSchema } } }, async (request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) => {
		try {
			const data = await Code.getFile(request.params.slug)
			reply.send(data)
		}
		catch (err) {
			reply.code(404).send(err)
		}
	})
}

export default codeRoutes
