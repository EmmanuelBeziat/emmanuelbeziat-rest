import type { MarkedFile } from '../types.js'

/**
 * Front matter readers. Front matter is untyped YAML, so each reader checks the runtime type and fails startup with a message naming the file and field, instead of serving a malformed record.
 */

const fail = (marked: MarkedFile, key: string, problem: string): never => {
	throw new Error(`"${marked.slug}": front matter "${key}" ${problem}`)
}

/**
 * Reads the required `title` from front matter, throwing if it is missing or blank rather than serving an item without one.
 * @param {MarkedFile} marked The parsed markdown file.
 * @returns {string} The title.
 */
export const requireTitle = (marked: MarkedFile): string => {
	const title = marked.meta.title
	if (typeof title !== 'string' || !title.trim()) {
		return fail(marked, 'title', 'is missing or empty')
	}
	return title
}

/**
 * Reads the required `date` from front matter, throwing if it is missing or unparseable. Defaulting instead would give undated items the server start time (moving on every restart) or a NaN that breaks date ordering.
 * @param {MarkedFile} marked The parsed markdown file.
 * @returns {Date | string} The date, unchanged.
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
 * Reads an optional string field.
 * @returns {string} The value, or `fallback` when absent.
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
 * Reads an optional list of strings. A single string is accepted as a one-item list (`tags: css` in YAML).
 * @returns {string[]} The values, or `fallback` when absent.
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
 * Reads an optional boolean field.
 * @returns {boolean} The value, or `fallback` when absent.
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
