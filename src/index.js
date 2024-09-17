import App from './classes/App.js'
import cors from '@fastify/cors'
// import favicons from 'fastify-favicon'
import { config } from './config.js'

/**
 * Initializes the server with necessary plugins and configurations
 */
class Server {
	constructor () {
		this.app = App

		this.setupPlugins()
	}

	setupPlugins () {
		this.setupCors()
		this.setupFavicons()
	}

	setupCors () {
		this.app.register(cors, config.cors)
	}

	setupFavicons () {
		/* this.app.register(favicons, {
			root: config.paths.public,
			name: 'favicon.ico'
		}) */
		this.app.get('/favicon.ico', (request, reply) => {
			reply.sendFile('favicons/favicon.ico')
		})
	}

	/**
   * Starts the server on the specified host and port
   */
	async start () {
		try {
			const address = await this.app.listen({ port: config.port, host: config.host })
			console.log(`Server started on ${address}`)
		}
		catch (error) {
			console.error(`Error starting server: ${error}`)
			process.exit(1)
		}
	}
}

const server = new Server()
server.start()
