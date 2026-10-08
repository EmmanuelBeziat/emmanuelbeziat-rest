import Portfolio from '../models/Portfolio.js'
import { PortfolioSchema } from '../utils/schemas.js'
import { createResourceRoutes, byDateDesc } from '../utils/resource.js'

/**
 * Routes for the Portfolio resource: newest first.
 */
export default createResourceRoutes({
	basePath: 'portfolio',
	model: Portfolio,
	itemSchema: PortfolioSchema,
	transform: byDateDesc
})
