import { FastifyReply } from 'fastify'
import { NotFoundError } from '../classes/NotFoundError'

/**
 * Sends a consistent JSON error response. Known "not found" errors become a
 * 404 with their message; anything unexpected is logged and reported as a 500
 * without leaking internal details to the client.
 * @param {FastifyReply} reply The Fastify reply to send through.
 * @param {unknown} err The error caught in the route handler.
 */
export function sendError (reply: FastifyReply, err: unknown): void {
	if (err instanceof NotFoundError) {
		reply.code(404).send({ statusCode: 404, error: 'Not Found', message: err.message })
		return
	}

	reply.log.error(err)
	reply.code(500).send({ statusCode: 500, error: 'Internal Server Error', message: 'An error occurred' })
}
