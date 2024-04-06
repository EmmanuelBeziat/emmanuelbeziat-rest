import RSS from '../models/RSS.js'

export class RssController {

	constructor () {
		this.model = new RSS()
	}

	/**
	 * Handles requests for the rss file
   * @param {Object} req The request object, containing parameters and query.
   * @param {Object} reply The reply object to send the response.
	 */
	serve (req, reply) {
		this.model.serveRSS(reply)
			.then(data => reply.type('application/xml').send(data))
			.catch(err => reply.code(404).send(err))
	}
}

export default RssController
