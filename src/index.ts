import App from './classes/App.js'
import { config } from './config.js'

/**
 * Starts the server.
 */
const start = async () => {
	try {
		const address = await App.listen({ port: config.port, host: config.host })
		console.log(`Server started on ${address}`)
	}
	catch (error) {
		console.error(`Error starting server: ${error}`)
		process.exit(1)
	}
}

/**
 * Closes the server gracefully on a termination signal, letting in-flight
 * requests finish before exiting (important for `pm2 reload`).
 * @param {string} signal The received process signal.
 */
const shutdown = async (signal: string) => {
	console.log(`Received ${signal}, shutting down...`)
	try {
		await App.close()
		process.exit(0)
	}
	catch (error) {
		console.error(`Error during shutdown: ${error}`)
		process.exit(1)
	}
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

start()
