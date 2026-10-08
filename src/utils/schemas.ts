import Type, { type Static } from 'typebox'

export const SLUG_PATTERN = /^[a-z0-9-]+$/

/**
 * `:slug` URL parameter: lowercase letters, digits and hyphens
 */
export const SlugParams = Type.Object({
	slug: Type.String({ pattern: SLUG_PATTERN.source })
})

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

/**
 * Collection item schemas, without the raw `markdown`
 */
export const PostListSchema = Type.Omit(PostSchema, ['markdown'])
export const PortfolioListSchema = Type.Omit(PortfolioSchema, ['markdown'])
export const CodeListSchema = Type.Omit(CodeSchema, ['markdown'])

export type PostData = Static<typeof PostSchema>
export type PortfolioData = Static<typeof PortfolioSchema>
export type CodeData = Static<typeof CodeSchema>
