import Portfolio from '../models/Portfolio'
import { createResourceRoutes, byDateDesc } from '../utils/resource'

const PortfolioItemSchema = {
	type: 'object',
	properties: {
		title: { type: 'string' },
		slug: { type: 'string' },
		image: { type: 'string' },
		date: { anyOf: [{ type: 'string' }, { type: 'number' }] },
		tags: { type: 'array', items: { type: 'string' } },
		clients: { type: 'array', items: { type: 'string' } },
		categories: { type: 'array', items: { type: 'string' } },
		description: { type: 'string' },
		color: { type: 'string' },
		markdown: { type: 'string' },
		markup: { type: 'string' },
	},
	required: ['slug']
}

/**
 * Routes for the Portfolio resource: newest first.
 */
export default createResourceRoutes({
	basePath: 'portfolio',
	model: Portfolio,
	itemSchema: PortfolioItemSchema,
	transform: byDateDesc
})
