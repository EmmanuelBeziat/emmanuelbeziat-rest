import Code from '../models/Code'
import { createResourceRoutes } from '../utils/resource'

const CodeItemSchema = {
	type: 'object',
	properties: {
		slug: { type: 'string' },
		markdown: { type: 'string' },
		markup: { type: 'string' },
	},
	required: ['slug']
}

/**
 * Routes for the Code resource: most recently added first.
 */
export default createResourceRoutes({
	basePath: 'codes',
	model: Code,
	itemSchema: CodeItemSchema,
	transform: items => [...items].reverse()
})
