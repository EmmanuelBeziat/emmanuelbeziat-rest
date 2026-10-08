import type { MarkedFile } from '../types.js'

/**
 * Throws a front matter error naming the file and field
 * @param {MarkedFile} marked The parsed markdown file
 * @param {string} key The front matter field
 * @param {string} problem What is wrong with the field
 * @throws {Error} Always
 */
const fail = (marked: MarkedFile, key: string, problem: string): never => {
	throw new Error(`"${marked.slug}": front matter "${key}" ${problem}`)
}

/**
 * Reads the required `title`
 * @param {MarkedFile} marked The parsed markdown file
 * @returns {string} The title
 * @throws {Error} When the title is missing or blank
 */
export const requireTitle = (marked: MarkedFile): string => {
	const title = marked.meta.title
	if (typeof title !== 'string' || !title.trim()) {
		return fail(marked, 'title', 'is missing or empty')
	}
	return title
}

/**
 * Reads the required `date`
 * @param {MarkedFile} marked The parsed markdown file
 * @returns {Date | string} The date, unchanged
 * @throws {Error} When the date is missing or invalid
 */
export const requireDate = (marked: MarkedFile): Date | string => {
	const date = marked.meta.date
	if (!(date instanceof Date) && typeof date !== 'string') {
		return fail(marked, 'date', 'is missing')
	}
	if (Number.isNaN(new Date(date).getTime())) {
		return fail(marked, 'date', `is not a valid date: ${String(date)}`)
	}
	return date
}

/**
 * Reads an optional string field
 * @param {MarkedFile} marked The parsed markdown file
 * @param {string} key The front matter field
 * @param {string} fallback The value when absent
 * @returns {string} The value
 * @throws {Error} When the value is not a string
 */
export const optionalString = (marked: MarkedFile, key: string, fallback = ''): string => {
	const value = marked.meta[key]
	if (value === undefined || value === null) {
		return fallback
	}
	if (typeof value !== 'string') {
		return fail(marked, key, `must be a string, got ${JSON.stringify(value)}`)
	}
	return value
}

/**
 * Reads an optional list of strings, a single string becoming a one-item list
 * @param {MarkedFile} marked The parsed markdown file
 * @param {string} key The front matter field
 * @param {string[]} fallback The value when absent
 * @returns {string[]} The values
 * @throws {Error} When the value is not a string or a list of strings
 */
export const optionalStringList = (marked: MarkedFile, key: string, fallback: string[] = []): string[] => {
	const value = marked.meta[key]
	if (value === undefined || value === null) {
		return fallback
	}
	if (typeof value === 'string') {
		return [value]
	}
	if (!Array.isArray(value) || !value.every(item => typeof item === 'string')) {
		return fail(marked, key, `must be a list of strings, got ${JSON.stringify(value)}`)
	}
	return value
}

/**
 * Reads an optional boolean field
 * @param {MarkedFile} marked The parsed markdown file
 * @param {string} key The front matter field
 * @param {boolean} fallback The value when absent
 * @returns {boolean} The value
 * @throws {Error} When the value is not a boolean
 */
export const optionalBoolean = (marked: MarkedFile, key: string, fallback: boolean): boolean => {
	const value = marked.meta[key]
	if (value === undefined || value === null) {
		return fallback
	}
	if (typeof value !== 'boolean') {
		return fail(marked, key, `must be true or false, got ${JSON.stringify(value)}`)
	}
	return value
}
