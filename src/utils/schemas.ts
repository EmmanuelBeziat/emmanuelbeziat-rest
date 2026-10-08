import Type, { type Static } from 'typebox'

/**
 * Shared schemas: each resource is described once here, and both its TypeScript type (`Static<>`) and its response serialization derive from that single definition.
 */

export const SLUG_PATTERN = /^[a-z0-9-]+$/

// Validates a `:slug` URL parameter: lowercase letters, digits and hyphens only.
export const SlugParams = Type.Object({
	slug: Type.String({ pattern: SLUG_PATTERN.source })
})

// gray-matter yields a Date for unquoted YAML dates and a string otherwise; both are passed through unchanged.
const DateField = Type.Unsafe<Date | string>({ anyOf: [{ type: 'string' }, { type: 'number' }] })

export const PostSchema = Type.Object({
	title: Type.String(),
	slug: Type.String(),
	image: Type.String(),
	date: DateField,
	tags: Type.Array(Type.String()),
	categories: Type.Array(Type.String()),
	description: Type.String(),
	publish: Type.Boolean(),
	markdown: Type.String(),
	markup: Type.String(),
})

export const PortfolioSchema = Type.Object({
	title: Type.String(),
	slug: Type.String(),
	image: Type.String(),
	date: DateField,
	tags: Type.Array(Type.String()),
	color: Type.String(),
	clients: Type.Array(Type.String()),
	categories: Type.Array(Type.String()),
	description: Type.String(),
	markdown: Type.String(),
	markup: Type.String(),
})

export const CodeSchema = Type.Object({
	slug: Type.String(),
	markdown: Type.String(),
	markup: Type.String(),
})

export type PostData = Static<typeof PostSchema>
export type PortfolioData = Static<typeof PortfolioSchema>
export type CodeData = Static<typeof CodeSchema>
