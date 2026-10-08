import Type, { type TSchema, type Static } from 'typebox'
import type { FastifyInstance } from 'fastify'
import type ModelHandler from '../classes/ModelHandler.js'
import { SlugParams } from './schemas.js'

interface ResourceRoutesOptions<S extends TSchema> {
	// URL segment for the resource, e.g. 'posts' -> /posts and /posts/:slug
	basePath: string
	// The model singleton backing the resource. Its type is tied to the schema: a model missing a field the schema declares does not compile.
	model: ModelHandler<Static<S> & { slug: string }>
	// Schema describing a single item, used for response serialization.
	itemSchema: S
	// Optional ordering applied to the collection before it is sent.
	transform?: (items: Static<S>[]) => Static<S>[]
}

/**
 * Builds a Fastify plugin exposing the standard read-only routes for a markdown-backed resource: a collection route (`/basePath`) and a detail route (`/basePath/:slug`).
 * Handlers just return or throw: the global error handler turns errors into responses.
 */
export function createResourceRoutes<S extends TSchema> ({ basePath, model, itemSchema, transform = items => items }: ResourceRoutesOptions<S>) {

	// The cache never changes after startup, so the ordered collection is computed once.
	let collection: Static<S>[] | null = null

	return async function (fastify: FastifyInstance) {
		// The schema/model match is enforced by ResourceRoutesOptions: a type provider cannot resolve a still-generic schema here.
		fastify.get(`/${basePath}`, { schema: { response: { 200: Type.Array(itemSchema) } } }, async () => {
			collection ??= transform(model.getAllFiles())
			return collection
		})

		fastify.get<{ Params: Static<typeof SlugParams> }>(`/${basePath}/:slug`, { schema: { params: SlugParams, response: { 200: itemSchema } } }, async request => {
			return model.getFile(request.params.slug)
		})
	}
}

/**
 * Orders items by their `date` field, most recent first. Returns a new array.
 */
export const byDateDesc = <T extends { date: Date | string }> (items: T[]): T[] =>
	items.toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
