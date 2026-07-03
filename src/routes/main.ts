import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import rss from '../models/RSS'
import { sendError } from '../utils/errors'

/**
 * Encapsulates the core routes of the application, like home and RSS.
 * @param {FastifyInstance} fastify - The Fastify instance.
 */
async function mainRoutes (fastify: FastifyInstance) {
	// Home route
	fastify.get('/', { schema: { response: { 200: { type: 'array', items: { type: 'object', properties: { hello: { type: 'string' } }, required: ['hello'] } } } } }, async (_request: FastifyRequest, reply: FastifyReply) => {
		reply.send([{ hello: 'world' }])
	})

	// RSS feed route
	fastify.get('/rss/blog.xml', { schema: { response: { 200: { type: 'string' } } } }, async (_request: FastifyRequest, reply: FastifyReply) => {
		try {
			const rssData = await rss.serveRSS()
			reply.type('application/xml').send(rssData)
		}
		catch (err) {
			sendError(reply, err)
		}
	})
}

export default mainRoutes
