import { FastifyRequest, FastifyReply } from 'fastify'
import ModelHandler from './ModelHandler.js'

/**
 * Main routing actions
 */
class MainController {
	private model: ModelHandler

	/**
	 * @param {ModelHandler} model
	 */
	constructor (model: ModelHandler) {
		this.model = model
	}

	/**
	 * Handles the index route by retrieving and sending all files in reverse order.
	 * @param {FastifyRequest} req The request object.
	 * @param {FastifyReply} reply The reply object to send the response.
	 */
	index (req: FastifyRequest, reply: FastifyReply) {
		this.model.getAllFiles()
			.then(data => reply.send(data.reverse()))
			.catch(err => reply.code(404).send(err))
	}

	/**
	 * Handles requests for a single file by slug and query parameters.
	 * @param {FastifyRequest} req The request object, containing parameters and query.
	 * @param {FastifyReply} reply The reply object to send the response.
	 */
	single (req: FastifyRequest<{ Params: { slug: string }, Querystring: any }>, reply: FastifyReply) {
		this.model.getFile(req.params.slug)
			.then(data => reply.send(data))
			.catch(err => reply.code(404).send(err))
	}
}

export default MainController
