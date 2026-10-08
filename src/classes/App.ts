import fastify, { LogController, type FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import etag from '@fastify/etag'
import favicons from 'fastify-favicon'
import { config } from '../config.js'
import postRoutes from '../routes/posts.js'
import portfolioRoutes from '../routes/portfolio.js'
import codeRoutes from '../routes/code.js'
import mainRoutes from '../routes/main.js'
import Post from '../models/Post.js'
import Portfolio from '../models/Portfolio.js'
import Code from '../models/Code.js'
import { errorHandler, notFoundHandler } from '../utils/errors.js'

/**
 * Initializes and configures the Fastify application.
 */
class App {
	public app: FastifyInstance

	constructor () {
		this.app = fastify({
			logger: { level: process.env.LOG_LEVEL || 'info' },
			// Per-request lines would drown the log; errors are still logged by the error handler.
			logController: new LogController({ disableRequestLogging: true })
		})
		this.configure()
	}

	configure () {
		// Register core plugins
		this.app.register(cors, config.cors)
		this.app.register(etag)

		// Content only changes on restart: clients may keep it but must revalidate, which the ETag turns into a cheap 304.
		this.app.addHook('onSend', async (_request, reply) => {
			if (!reply.hasHeader('cache-control')) {
				reply.header('cache-control', 'no-cache')
			}
		})
		this.app.register(favicons, {
			path: config.paths.favicons,
			name: 'favicon.ico'
		})

		// Register route plugins
		this.app.register(postRoutes)
		this.app.register(portfolioRoutes)
		this.app.register(codeRoutes)
		this.app.register(mainRoutes)

		this.app.setNotFoundHandler(notFoundHandler)
		this.app.setErrorHandler(errorHandler)

		// Ensure content caches are initialized before serving
		this.app.addHook('onReady', async () => {
			await Promise.all([
				Post.initialize(this.app.log),
				Portfolio.initialize(this.app.log),
				Code.initialize(this.app.log),
			])
		})
	}
}

export default new App().app
