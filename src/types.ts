export type { PostData, PortfolioData, CodeData } from './utils/schemas.js'

/**
 * A parsed markdown file, `meta` being the raw unvalidated front matter
 */
export interface MarkedFile {
	slug: string
	markdown: string
	html: string
	meta: Record<string, unknown>
}
