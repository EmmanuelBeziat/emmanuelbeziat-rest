import { describe, it, expect } from 'vitest'
import { requireEnv, config } from '../src/config'

// The cors `origin` option is a callback: (origin, cb) => void.
type OriginFn = (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => void

const isOriginAllowed = (origin: string | undefined): boolean => {
	let allowed = false
	;(config.cors.origin as unknown as OriginFn)(origin, (err, allow) => {
		allowed = !err && Boolean(allow)
	})
	return allowed
}

describe('config', () => {
	describe('requireEnv()', () => {
		it('returns the value when the variable is set', () => {
			process.env.__CONFIG_TEST__ = 'value'
			expect(requireEnv('__CONFIG_TEST__')).toBe('value')
			delete process.env.__CONFIG_TEST__
		})

		it('throws a clear error when the variable is missing', () => {
			delete process.env.__CONFIG_TEST__
			expect(() => requireEnv('__CONFIG_TEST__')).toThrow('Missing required environment variable: __CONFIG_TEST__')
		})

		it('throws when the variable is an empty string', () => {
			process.env.__CONFIG_TEST__ = ''
			expect(() => requireEnv('__CONFIG_TEST__')).toThrow('Missing required environment variable: __CONFIG_TEST__')
			delete process.env.__CONFIG_TEST__
		})
	})

	describe('content paths', () => {
		it('maps the required content paths from the environment', () => {
			expect(config.content.posts).toBe(process.env.POSTS)
			expect(config.content.codes).toBe(process.env.CODES)
			expect(config.content.portfolio).toBe(process.env.PORTFOLIO)
			expect(config.content.rss).toBe(process.env.RSS)
		})
	})

	describe('host/port', () => {
		it('parses PORT from the environment', () => {
			expect(config.port).toBe(3002)
		})

		it('falls back to 127.0.0.1 when HOST is unset', () => {
			expect(config.host).toBe('127.0.0.1')
		})
	})

	describe('cors origin policy', () => {
		it('allows server-side requests with no origin', () => {
			expect(isOriginAllowed(undefined)).toBe(true)
		})

		it('allows genuine localhost origins', () => {
			expect(isOriginAllowed('http://localhost')).toBe(true)
			expect(isOriginAllowed('http://localhost:3000')).toBe(true)
			expect(isOriginAllowed('https://localhost')).toBe(true)
		})

		it('allows the configured CORS_ORIGIN', () => {
			expect(isOriginAllowed('https://example.com')).toBe(true)
		})

		it('rejects look-alike localhost domains', () => {
			expect(isOriginAllowed('https://localhost.evil.com')).toBe(false)
		})

		it('rejects arbitrary origins', () => {
			expect(isOriginAllowed('https://evil.com')).toBe(false)
		})
	})
})
