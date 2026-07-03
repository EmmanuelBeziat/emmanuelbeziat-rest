import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import ModelHandler from '../classes/ModelHandler.js'
import { listSchema, detailSchema } from './schemas.js'
import { sendError } from './errors.js'

interface ResourceRoutesOptions<T extends { slug: string }> {
	// URL segment for the resource, e.g. 'posts' -> /posts and /posts/:slug
	basePath: string
	// The model singleton backing the resource.
	model: ModelHandler<T>
	// JSON Schema describing a single item, used for response serialization.
	itemSchema: object
	// Optional ordering applied to the collection before it is sent.
	transform?: (items: T[]) => T[]
}

/**
 * Builds a Fastify plugin exposing the standard read-only routes for a
 * markdown-backed resource: a collection route (`/basePath`) and a detail
 * route (`/basePath/:slug`).
 */
export function createResourceRoutes<T extends { slug: string }> ({ basePath, model, itemSchema, transform }: ResourceRoutesOptions<T>) {

	let collection: T[] | null = null

	return async function (fastify: FastifyInstance) {
		fastify.get(`/${basePath}`, { schema: listSchema(itemSchema) }, async (_request: FastifyRequest, reply: FastifyReply) => {
			try {
				if (!collection) {
					const data = await model.getAllFiles()
					collection = transform ? transform(data) : data
				}
				reply.send(collection)
			}
			catch (err) {
				sendError(reply, err)
			}
		})

		fastify.get(`/${basePath}/:slug`, { schema: detailSchema(itemSchema) }, async (request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) => {
			try {
				const data = await model.getFile(request.params.slug)
				reply.send(data)
			}
			catch (err) {
				sendError(reply, err)
			}
		})
	}
}

/**
 * Orders items by their `date` field, most recent first. Returns a new array.
 */
export const byDateDesc = <T extends { date: Date | string }> (items: T[]): T[] =>
	[...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
