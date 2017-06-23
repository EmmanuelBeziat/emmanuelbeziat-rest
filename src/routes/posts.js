/* emmanuelbeziat-rest
 *
 * ~/routes/posts.js - Posts routes
 */

import { Router } from 'express'

import articles from '../controllers/articles.js'
import portfolio from '../controllers/portfolio.js'

let router = new Router()

router.get('/posts', articles.listAll)
router.get('/posts/:slug', articles.getSingle)

router.get('/portfolio', portfolio.listAll)
router.get('/portfolio/:slug', portfolio.getSingle)

export default router