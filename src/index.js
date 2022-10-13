import App from './App.js'
import cors from '@fastify/cors'
import favicons from 'fastify-favicon'

App.register(cors, {
	origin: (origin, cb) => {
		if (/localhost/.test(origin) || 'https://www.emmanuelbeziat.com') {
			cb(null, true)
			return
		}

		cb(new Error('Not allowed'))
	}
})

App.register(favicons, {
	path: './public/favicons'
})

App.listen({ port: process.env.PORT || 3000 }, (err, address) => {
	if (err) {
		App.log.error(err)
		process.exit(1)
	}

	App.log.info(`Server started on ${address}`)
})
