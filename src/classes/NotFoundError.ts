/**
 * Error thrown when a requested resource does not exist in the cache.
 * Routes map this to a 404 response; any other error is treated as a 500.
 */
export class NotFoundError extends Error {
	constructor (message: string) {
		super(message)
		this.name = 'NotFoundError'
	}
}
