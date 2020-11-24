import App from './App.js'
import CORS from 'fastify-cors'

App.register(CORS, {
	origin: (origin, cb) => {
		if (/localhost/.test(origin) || 'https://www.emmanuelbeziat.com') {
			cb(null, true)
			return
		}

		cb(new Error('Not allowed'))
	}
})

App.listen(process.env.PORT || 3000, (err, address) => {
	if (err) {
		App.log.error(err)
		process.exit(1)
	}

	App.log.info(`Server started on ${address}`)
})
