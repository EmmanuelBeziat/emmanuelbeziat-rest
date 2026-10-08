import Code from '../models/Code.js'
import { CodeSchema } from '../utils/schemas.js'
import { createResourceRoutes } from '../utils/resource.js'

/**
 * Routes for the Code resource: most recently added first.
 */
export default createResourceRoutes({
	basePath: 'codes',
	model: Code,
	itemSchema: CodeSchema,
	transform: items => items.toReversed()
})
