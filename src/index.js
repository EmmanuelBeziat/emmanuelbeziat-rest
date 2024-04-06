import App from './App.js'
import cors from '@fastify/cors'
import favicons from 'fastify-favicon'

// CORS
App.register(cors, {
	origin: (origin, cb) => {
		// Allow requests from localhost or a specific domain
		if (/localhost/.test(origin) || 'https://www.emmanuelbeziat.com') {
			cb(null, true)
			return
		}

		cb(new Error('Not allowed'))
	}
})

App.register(favicons, {
	path: './public/favicons',
	name: 'favicon.ico'
})

// Server start
App.listen({ port: process.env.PORT || 3000, host: '127.0.0.1' })
	.then(address => {
		console.log(`Server started on ${address}`)
	})
	.catch(error => {
		console.log(`Error starting server: ${error}`)
		process.exit(1)
	})
