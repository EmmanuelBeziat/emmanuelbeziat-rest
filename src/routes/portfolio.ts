import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import Portfolio from '../models/Portfolio.js'

/**
 * Encapsulates the routes for the Portfolio resource.
 * @param {FastifyInstance} fastify - The Fastify instance.
 */
async function portfolioRoutes (fastify: FastifyInstance) {
	const PortfolioItemSchema = {
		type: 'object',
		properties: {
			title: { type: 'string' },
			slug: { type: 'string' },
			image: { type: 'string' },
			date: { anyOf: [{ type: 'string' }, { type: 'number' }] },
			tags: { type: 'array', items: { type: 'string' } },
			clients: { type: 'array', items: { type: 'string' } },
			categories: { type: 'array', items: { type: 'string' } },
			description: { type: 'string' },
			color: { type: 'string' },
			markdown: { type: 'string' },
			markup: { type: 'string' },
		},
		required: ['slug']
	}

	fastify.get('/portfolio', { schema: { response: { 200: { type: 'array', items: PortfolioItemSchema } } } }, async (_request: FastifyRequest, reply: FastifyReply) => {
		try {
			const data = await Portfolio.getAllFiles()
			const sortedData = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			reply.send(sortedData)
		}
		catch (err) {
			reply.code(404).send(err)
		}
	})

	fastify.get('/portfolio/:slug', { schema: { params: { type: 'object', properties: { slug: { type: 'string' } }, required: ['slug'] }, response: { 200: PortfolioItemSchema } } }, async (request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) => {
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
