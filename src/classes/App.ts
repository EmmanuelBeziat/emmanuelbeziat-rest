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
 * Fastify application: plugins, routes, handlers and content initialization
 */
class App {
	public app: FastifyInstance

	constructor () {
		this.app = fastify({
			logger: { level: process.env.LOG_LEVEL || 'info' },
			logController: new LogController({ disableRequestLogging: true })
		})
		this.configure()
	}

	/**
	 * Registers plugins, hooks, routes and global handlers
	 */
	configure () {
		this.app.register(cors, config.cors)
		this.app.register(etag)

		this.app.addHook('onSend', async (_request, reply) => {
			if (!reply.hasHeader('cache-control')) {
				reply.header('cache-control', 'no-cache')
			}
		})
		this.app.register(favicons, {
			path: config.paths.favicons,
			name: 'favicon.ico'
		})

		this.app.register(postRoutes)
		this.app.register(portfolioRoutes)
		this.app.register(codeRoutes)
		this.app.register(mainRoutes)

		this.app.setNotFoundHandler(notFoundHandler)
		this.app.setErrorHandler(errorHandler)

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
