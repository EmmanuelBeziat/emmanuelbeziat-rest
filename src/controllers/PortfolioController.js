import Portfolio from '../models/Portfolio.js'

export class PortfolioController {
	index (req, reply) {
		Portfolio.getAllPosts()
			.then(data => reply.send(data))
			.catch(err => reply.code(404).send(err))
	}

	single (req, reply) {
		Portfolio.getPost(req.params.slug, {...req.query})
			.then(data => reply.send(data))
			.catch(err => reply.code(404).send(err))
	}
}
