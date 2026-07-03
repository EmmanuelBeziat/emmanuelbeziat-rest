import { describe, it, expect, vi } from 'vitest'
import { sendError } from '../src/utils/errors'
import { NotFoundError } from '../src/classes/NotFoundError'

// Minimal FastifyReply stand-in capturing the status and payload.
const makeReply = () => ({
	statusCode: 0,
	body: null as any,
	log: { error: vi.fn() },
	code (status: number) { this.statusCode = status; return this },
	send (payload: unknown) { this.body = payload; return this },
})

describe('sendError', () => {
	it('maps NotFoundError to a 404 carrying its message', () => {
		const reply = makeReply()
		sendError(reply as any, new NotFoundError('No data found.'))

		expect(reply.statusCode).toBe(404)
		expect(reply.body).toEqual({ statusCode: 404, error: 'Not Found', message: 'No data found.' })
		expect(reply.log.error).not.toHaveBeenCalled()
	})

	it('maps an unexpected error to a 500 without leaking its message', () => {
		const reply = makeReply()
		sendError(reply as any, new Error('database exploded'))

		expect(reply.statusCode).toBe(500)
		expect(reply.body).toEqual({ statusCode: 500, error: 'Internal Server Error', message: 'An error occurred' })
		expect(reply.body.message).not.toContain('database')
		expect(reply.log.error).toHaveBeenCalledOnce()
	})

	it('treats non-Error throwables as a 500', () => {
		const reply = makeReply()
		sendError(reply as any, 'just a string')

		expect(reply.statusCode).toBe(500)
		expect(reply.body.statusCode).toBe(500)
	})
})
