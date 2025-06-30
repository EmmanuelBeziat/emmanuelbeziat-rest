import Portfolio from '../models/Portfolio.js'

/**
 * Encapsulates the routes for the Portfolio resource.
 * @param {import('fastify').FastifyInstance} fastify - The Fastify instance.
 */
async function portfolioRoutes (fastify) {
	fastify.get('/portfolio', async (_request, reply) => {
		try {
			const data = await Portfolio.getAllFiles()
			reply.send(data.reverse())
		}
		catch (err) {
			reply.code(404).send(err)
		}
	})

	fastify.get('/portfolio/:slug', async (request, reply) => {
		try {
			const data = await Portfolio.getFile(request.params.slug)
			reply.send(data)
		}
		catch (err) {
			reply.code(404).send(err)
		}
	})
}

export default portfolioRoutes
