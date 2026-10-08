import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Fastify from 'fastify'
import { errorHandler, notFoundHandler } from '../src/utils/errors.js'
import { NotFoundError } from '../src/classes/NotFoundError.js'

// A bare app whose routes throw, so each error path goes through the real handler.
const app = Fastify({ logger: false })
app.setErrorHandler(errorHandler)
app.setNotFoundHandler(notFoundHandler)
app.get('/not-found', async () => { throw new NotFoundError('No data found.') })
app.get('/crash', async () => { throw new Error('database exploded') })
app.get('/string', async () => { throw 'just a string' })
app.get('/validated', { schema: { querystring: { type: 'object', properties: { n: { type: 'integer' } } } } }, async () => 'ok')

const get = async (url: string) => {
	const response = await app.inject({ method: 'GET', url })
	return { status: response.statusCode, body: JSON.parse(response.body) }
}

describe('errorHandler', () => {
	beforeAll(() => app.ready())
	afterAll(() => app.close())

	it('maps NotFoundError to a 404 carrying its message', async () => {
		const { status, body } = await get('/not-found')
		expect(status).toBe(404)
		expect(body).toEqual({ statusCode: 404, error: 'Not Found', message: 'No data found.' })
	})

	it('maps an unexpected error to a 500 without leaking its message', async () => {
		const { status, body } = await get('/crash')
		expect(status).toBe(500)
		expect(body).toEqual({ statusCode: 500, error: 'Internal Server Error', message: 'An error occurred' })
	})

	it('treats non-Error throwables as a 500', async () => {
		const { status, body } = await get('/string')
		expect(status).toBe(500)
		expect(body.statusCode).toBe(500)
	})

	it('keeps the status and message of validation errors', async () => {
		const { status, body } = await get('/validated?n=abc')
		expect(status).toBe(400)
		expect(body).toMatchObject({ statusCode: 400, error: 'Bad Request' })
		expect(body.message).toContain('integer')
	})

	it('answers unknown routes with a structured 404', async () => {
		const { status, body } = await get('/nowhere')
		expect(status).toBe(404)
		expect(body).toEqual({ statusCode: 404, error: 'Not Found', message: 'Route GET /nowhere not found' })
	})
})
