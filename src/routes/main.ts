import Type from 'typebox'
import type { FastifyInstance } from 'fastify'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import rss from '../models/RSS.js'

const HomeSchema = Type.Array(Type.Object({ hello: Type.String() }))

/**
 * Core routes: home and RSS feed
 * @param {FastifyInstance} fastify The Fastify instance
 */
async function mainRoutes (fastify: FastifyInstance) {
	const app = fastify.withTypeProvider<TypeBoxTypeProvider>()

	app.get('/', { schema: { response: { 200: HomeSchema } } }, async () => [{ hello: 'world' }])

	app.get('/rss/blog.xml', { schema: { response: { 200: Type.String() } } }, async (_request, reply) => {
		reply.type('application/xml')
		return rss.serveRSS()
	})
}

export default mainRoutes
