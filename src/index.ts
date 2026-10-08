import App from './classes/App.js'
import { config } from './config.js'

/**
 * Starts the server. Fastify logs the listening address itself.
 */
const start = async () => {
	try {
		await App.listen({ port: config.port, host: config.host })
	}
	catch (error) {
		App.log.fatal(error, 'Error starting server')
		process.exit(1)
	}
}

/**
 * Closes the server gracefully on a termination signal, letting in-flight
 * requests finish before exiting (important for `pm2 reload`).
 * @param {string} signal The received process signal.
 */
const shutdown = async (signal: string) => {
	App.log.info(`Received ${signal}, shutting down...`)
	try {
		await App.close()
		process.exit(0)
	}
	catch (error) {
		App.log.error(error, 'Error during shutdown')
		process.exit(1)
	}
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

start()
