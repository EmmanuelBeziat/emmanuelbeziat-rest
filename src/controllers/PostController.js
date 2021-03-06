import Post from '../models/Post.js'

export class PostController {
	index (req, reply) {
		Post.getAllPosts()
			.then(data => reply.send(data))
			.catch(err => reply.code(404).send(err))
	}

	single (req, reply) {
		Post.getPost(req.params.slug, {...req.query})
			.then(data => reply.send(data))
			.catch(err => reply.code(404).send(err))
	}
}
