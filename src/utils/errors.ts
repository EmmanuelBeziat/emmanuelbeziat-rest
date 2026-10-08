import { STATUS_CODES } from 'node:http'
import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

/**
 * Global error handler: 4xx errors keep their status and message, anything else is logged and answered with a generic 500
 * @param {FastifyError} error The thrown error
 * @param {FastifyRequest} request The request
 * @param {FastifyReply} reply The reply
 */
export function errorHandler (error: FastifyError, request: FastifyRequest, reply: FastifyReply): void {
	const status = error?.statusCode ?? 500

	if (status >= 500) {
		request.log.error(error)
		reply.code(500).send({ statusCode: 500, error: 'Internal Server Error', message: 'An error occurred' })
		return
	}

	reply.code(status).send({ statusCode: status, error: STATUS_CODES[status] ?? 'Error', message: error.message })
}

/**
 * Global handler for unknown routes
 * @param {FastifyRequest} request The request
 * @param {FastifyReply} reply The reply
 */
export function notFoundHandler (request: FastifyRequest, reply: FastifyReply): void {
	reply.code(404).send({ statusCode: 404, error: 'Not Found', message: `Route ${request.method} ${request.url} not found` })
}
