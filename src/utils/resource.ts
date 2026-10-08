import Type, { type TSchema, type Static } from 'typebox'
import type { FastifyInstance } from 'fastify'
import type ModelHandler from '../classes/ModelHandler.js'
import { SlugParams } from './schemas.js'

interface ResourceRoutesOptions<S extends TSchema> {
	/** URL segment, e.g. 'posts' for /posts and /posts/:slug */
	basePath: string
	/** Model backing the resource, typed after the item schema */
	model: ModelHandler<Static<S> & { slug: string }>
	/** Schema of a single item */
	itemSchema: S
	/** Schema of the collection items, defaults to the item schema */
	listItemSchema?: TSchema
	/** Ordering applied to the collection */
	transform?: (items: Static<S>[]) => Static<S>[]
}

/**
 * Builds a Fastify plugin exposing a collection route (`/basePath`) and a detail route (`/basePath/:slug`)
 * @param {ResourceRoutesOptions} options The resource options
 * @returns {Function} The Fastify plugin
 */
export function createResourceRoutes<S extends TSchema> ({ basePath, model, itemSchema, listItemSchema = itemSchema, transform = items => items }: ResourceRoutesOptions<S>) {
	let collection: Static<S>[] | null = null

	return async function (fastify: FastifyInstance) {
		fastify.get(`/${basePath}`, { schema: { response: { 200: Type.Array(listItemSchema) } } }, async () => {
			collection ??= transform(model.getAllFiles())
			return collection
		})

		fastify.get<{ Params: Static<typeof SlugParams> }>(`/${basePath}/:slug`, { schema: { params: SlugParams, response: { 200: itemSchema } } }, async request => {
			return model.getFile(request.params.slug)
		})
	}
}

/**
 * Orders items by their `date` field, most recent first
 * @param {T[]} items The items
 * @returns {T[]} A new sorted array
 */
export const byDateDesc = <T extends { date: Date | string }> (items: T[]): T[] =>
	items.toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
