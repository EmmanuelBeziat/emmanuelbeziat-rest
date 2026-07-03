import fastify, { FastifyInstance, FastifyError } from 'fastify'
import cors from '@fastify/cors'
import favicons from 'fastify-favicon'
import { config } from '../config'
import postRoutes from '../routes/posts'
import portfolioRoutes from '../routes/portfolio'
import codeRoutes from '../routes/code'
import mainRoutes from '../routes/main'
import Post from '../models/Post'
import Portfolio from '../models/Portfolio'
import Code from '../models/Code'

/**
 * Initializes and configures the Fastify application.
 */
class App {
	public app: FastifyInstance

	constructor () {
		this.app = fastify({ logger: { level: process.env.LOG_LEVEL || 'warn' } })
		this.configure()
	}

	configure () {
		// Register core plugins
		this.app.register(cors, config.cors)
		this.app.register(favicons, {
			path: config.paths.favicons,
			name: 'favicon.ico'
		})

		// Register route plugins
		this.app.register(postRoutes)
		this.app.register(portfolioRoutes)
		this.app.register(codeRoutes)
		this.app.register(mainRoutes)

		// Global not found handler
		this.app.setNotFoundHandler((request, reply) => {
			reply
				.code(404)
				.type('application/json')
				.send({
					statusCode: 404,
					error: 'Not Found',
					message: `Route ${request.method} ${request.url} not found`
				})
		})

		// Global error handler
		this.app.setErrorHandler((error: FastifyError, _request, reply) => {
			const status = error.statusCode || (reply.statusCode >= 400 ? reply.statusCode : 500)
			reply
				.code(status)
				.type('application/json')
				.send({
					statusCode: status,
					error: status === 500 ? 'Internal Server Error' : 'Error',
					message: error.message || 'An error occurred'
				})
		})

		// Ensure content caches are initialized before serving
		this.app.addHook('onReady', async () => {
			await Promise.all([
				Post.initialize(),
				Portfolio.initialize(),
				Code.initialize(),
			])
		})
	}
}

export default new App().app
