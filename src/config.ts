import path from 'node:path'
import type { FastifyCorsOptions } from '@fastify/cors'

const __dirname = import.meta.dirname

/**
 * Reads a required environment variable, failing fast with a clear message if it is missing rather than letting an `undefined` path surface later
 * @param {string} key The environment variable name
 * @returns {string} The variable's value
 */
export const requireEnv = (key: string): string => {
	const value = process.env[key]
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`)
	}
	return value
}

/**
 * Parses a TCP port, rejecting anything that is not an integer in 1-65535 (PORT=abc would otherwise become NaN)
 * @param {string | undefined} value The raw value, or undefined for the default
 * @returns {number} The port number
 */
export const parsePort = (value: string | undefined): number => {
	if (value === undefined || value === '') {
		return 3000
	}
	const port = Number(value)
	if (!Number.isInteger(port) || port < 1 || port > 65535) {
		throw new Error(`Invalid PORT: "${value}" (expected an integer between 1 and 65535)`)
	}
	return port
}

export const config = {
	host: process.env.HOST || '127.0.0.1',
	port: parsePort(process.env.PORT),
	paths: {
		public: path.resolve(__dirname, '../public'),
		favicons: path.resolve(__dirname, '../public/favicons')
	},
	// Filesystem locations of the markdown content, validated at startup.
	content: {
		posts: requireEnv('POSTS'),
		codes: requireEnv('CODES'),
		portfolio: requireEnv('PORTFOLIO'),
		rss: requireEnv('RSS')
	},
	cors: {
		// Allow requests from localhost, a specific domain, or server-side requests (no origin).
		// A rejected origin is answered normally, just without CORS headers: the browser blocks it. Passing an Error here would turn it into a 500.
		origin: (origin, cb) => {
			const allowed = !origin
				|| /^https?:\/\/localhost(:\d+)?$/.test(origin)
				|| origin === process.env.CORS_ORIGIN
			cb(null, allowed)
		}
	} satisfies FastifyCorsOptions
}
