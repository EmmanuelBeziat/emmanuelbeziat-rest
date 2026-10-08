/**
 * Error thrown when a requested resource does not exist in the cache.
 * Its `statusCode` is read by the global error handler, which turns it into a 404; any error without one is treated as a 500.
 */
export class NotFoundError extends Error {
	readonly statusCode = 404

	constructor (message: string) {
		super(message)
		this.name = 'NotFoundError'
	}
}
