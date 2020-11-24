import fastify from 'fastify'
import { Router } from './routes/Routes.js'

class App {
	constructor () {
		this.app = fastify()
		this.router = new Router()
		this.router.routes(this.app)
	}
}

export default new App().app
