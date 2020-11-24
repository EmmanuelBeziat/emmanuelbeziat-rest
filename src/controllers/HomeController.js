export class HomeController {
	index (req, reply) {
		reply.send([
			{ hello: 'world' }
		])
	}
}
