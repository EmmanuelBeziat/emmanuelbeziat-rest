import Post from '../models/Post.js'
import MainController from '../classes/MainController.js'

export class PostController extends MainController {
	constructor () {
		super(Post)
	}
}
