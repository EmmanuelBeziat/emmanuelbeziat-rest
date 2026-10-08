import Type from 'typebox'
import type { FastifyInstance } from 'fastify'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import rss from '../models/RSS.js'

const HomeSchema = Type.Array(Type.Object({ hello: Type.String() }))

/**
 * Encapsulates the core routes of the application, like home and RSS.
 * @param {FastifyInstance} fastify - The Fastify instance.
 */
async function mainRoutes (fastify: FastifyInstance) {
	const app = fastify.withTypeProvider<TypeBoxTypeProvider>()

	// Home route
	app.get('/', { schema: { response: { 200: HomeSchema } } }, async () => [{ hello: 'world' }])

	// RSS feed route
	app.get('/rss/blog.xml', { schema: { response: { 200: Type.String() } } }, async (_request, reply) => {
		reply.type('application/xml')
		return rss.serveRSS()
	})
}

export default mainRoutes
