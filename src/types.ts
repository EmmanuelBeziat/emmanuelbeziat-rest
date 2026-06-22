export interface MarkedFile {
	slug: string
	markdown: string
	html: string
	meta: {
		title: string
		image?: string
		date?: Date
		tags?: string[]
		color?: string
		clients?: string[]
		categories?: string[]
		description?: string
		publish?: boolean
	}
}

export interface PostData {
	title: string
	slug: string
	image: string
	date: Date | string
	tags: string[]
	categories: string[]
	description: string
	publish: boolean
	markdown: string
	markup: string
}

export interface PortfolioData {
	title: string
	slug: string
	image: string
	date: Date | string
	tags: string[]
	color: string
	clients: string[]
	categories: string[]
	description: string
	markdown: string
	markup: string
}

export interface CodeData {
	slug: string
	markdown: string
	markup: string
}
