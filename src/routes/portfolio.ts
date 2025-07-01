import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import Portfolio from '../models/Portfolio.js'

/**
 * Encapsulates the routes for the Portfolio resource.
 * @param {FastifyInstance} fastify - The Fastify instance.
 */
async function portfolioRoutes (fastify: FastifyInstance) {
	fastify.get('/portfolio', async (_request: FastifyRequest, reply: FastifyReply) => {
		try {
			const data = await Portfolio.getAllFiles()
			const sortedData = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			reply.send(sortedData)
		}
		catch (err) {
			reply.code(404).send(err)
		}
	})

	fastify.get('/portfolio/:slug', async (request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) => {
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
