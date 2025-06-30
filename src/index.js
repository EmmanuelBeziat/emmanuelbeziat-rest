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

start()
