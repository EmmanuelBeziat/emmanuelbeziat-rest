/* emmanuelbeziat-rest
 *
 * ~/routes/system.js - System routes
 */

import { Router } from 'express'

let router = new Router()

router.get('/', (request, response) => {
	response.render('home.ejs', { message: 'Welcome' })
})

router.get('*', (request, response) => {
		response.status(404).send('There is no valid data here')
	})

export default router