import App from './App.js'

App.listen(process.env.PORT || 3000, (err, address) => {
	if (err) {
		App.log.error(err)
		process.exit(1)
	}

	App.log.info(`Server started on ${address}`)
})
