import Code from '../models/Code.js'

/**
 * Encapsulates the routes for the Code resource.
 * @param {import('fastify').FastifyInstance} fastify - The Fastify instance.
 */
async function codeRoutes (fastify) {
	fastify.get('/codes', async (_request, reply) => {
		try {
			const data = await Code.getAllFiles()
			reply.send(data.reverse())
		}
		catch (err) {
			reply.code(404).send(err)
		}
	})

	fastify.get('/codes/:slug', async (request, reply) => {
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
