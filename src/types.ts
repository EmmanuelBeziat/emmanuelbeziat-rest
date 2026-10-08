export type { PostData, PortfolioData, CodeData } from './utils/schemas.js'

/**
 * A parsed markdown file. `meta` is the raw front matter: it comes from YAML, so nothing about its shape is guaranteed until the `utils/meta.ts` readers check it.
 */
export interface MarkedFile {
	slug: string
	markdown: string
	html: string
	meta: Record<string, unknown>
}
