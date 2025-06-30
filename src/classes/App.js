import fastify from 'fastify'
import cors from '@fastify/cors'
import favicons from 'fastify-favicon'
import { config } from '../config.js'
import postRoutes from '../routes/posts.js'
import portfolioRoutes from '../routes/portfolio.js'
import codeRoutes from '../routes/code.js'
import mainRoutes from '../routes/main.js'

/**
 * Initializes and configures the Fastify application.
 */
class App {
	constructor () {
		this.app = fastify()
		this.configure()
	}

	configure () {
		// Register core plugins
		this.app.register(cors, config.cors)
		this.app.register(favicons, {
			root: config.paths.public,
			name: 'favicon.ico'
		})

		// Register route plugins
		this.app.register(postRoutes)
		this.app.register(portfolioRoutes)
		this.app.register(codeRoutes)
		this.app.register(mainRoutes)
	}
}

export default new App().app
