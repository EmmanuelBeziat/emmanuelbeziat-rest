import { MarkedFile } from '../types.js'

/**
 * Reads the required `title` from front matter, throwing if it is missing or blank rather than serving an item without one.
 * @param {MarkedFile} marked The parsed markdown file.
 * @returns {string} The title.
 */
export const requireTitle = (marked: MarkedFile): string => {
	const title: unknown = marked.meta.title
	if (typeof title !== 'string' || !title.trim()) {
		throw new Error(`"${marked.slug}": front matter "title" is missing or empty`)
	}
	return title
}

/**
 * Reads the required `date` from front matter, throwing if it is missing or unparseable. Defaulting instead would give undated items the server start time (moving on every restart) or a NaN that breaks date ordering.
 * @param {MarkedFile} marked The parsed markdown file.
 * @returns {Date | string} The date, unchanged.
 */
export const requireDate = (marked: MarkedFile): Date | string => {
	const date: unknown = marked.meta.date
	if (!(date instanceof Date) && typeof date !== 'string') {
		throw new Error(`"${marked.slug}": front matter "date" is missing`)
	}
	if (Number.isNaN(new Date(date).getTime())) {
		throw new Error(`"${marked.slug}": front matter "date" is not a valid date: ${String(date)}`)
	}
	return date
}
