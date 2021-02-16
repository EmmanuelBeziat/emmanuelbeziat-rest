import Code from '../models/Code.js'

export class CodeController {
	index (req, reply) {
		Code.getAllCodes()
			.then(data => reply.send(data))
			.catch(err => reply.code(404).send(err))
	}

	single (req, reply) {
		Code.getCode(req.params.slug, {...req.query})
			.then(data => reply.send(data))
			.catch(err => reply.code(404).send(err))
	}
}
