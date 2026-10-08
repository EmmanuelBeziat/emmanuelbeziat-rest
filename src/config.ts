import path from 'node:path'
import type { FastifyCorsOptions } from '@fastify/cors'

const __dirname = import.meta.dirname

/**
 * Reads a required environment variable
 * @param {string} key The environment variable name
 * @returns {string} The variable's value
 * @throws {Error} When the variable is missing or empty
 */
export const requireEnv = (key: string): string => {
	const value = process.env[key]
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`)
	}
	return value
}

/**
 * Parses a TCP port
 * @param {string | undefined} value The raw value, undefined or empty for the default
 * @returns {number} The port number, 3000 by default
 * @throws {Error} When the value is not an integer between 1 and 65535
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
	content: {
		posts: requireEnv('POSTS'),
		codes: requireEnv('CODES'),
		portfolio: requireEnv('PORTFOLIO'),
		rss: requireEnv('RSS')
	},
	cors: {
		origin: (origin, cb) => {
			const allowed = !origin
				|| /^https?:\/\/localhost(:\d+)?$/.test(origin)
				|| origin === process.env.CORS_ORIGIN
			cb(null, allowed)
		}
	} satisfies FastifyCorsOptions
}
