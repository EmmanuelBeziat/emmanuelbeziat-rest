/**
 * Error thrown when a requested resource does not exist, answered as a 404
 */
export class NotFoundError extends Error {
	readonly statusCode = 404

	/**
	 * @param {string} message The message sent to the client
	 */
	constructor (message: string) {
		super(message)
		this.name = 'NotFoundError'
	}
}
