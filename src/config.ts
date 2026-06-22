import * as path from 'path'
import { fileURLToPath } from 'url'
import { FastifyCorsOptions } from '@fastify/cors'

// Simulate __dirname in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Reads a required environment variable, failing fast with a clear message
 * if it is missing rather than letting an `undefined` path surface later.
 * @param {string} key The environment variable name.
 * @returns {string} The variable's value.
 */
export const requireEnv = (key: string): string => {
	const value = process.env[key]
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`)
	}
	return value
}

export const config = {
	host: process.env.HOST || '127.0.0.1',
	port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
	paths: {
		// Path to the public directory
		public: path.resolve(__dirname, '../public'),

		// Path to the favicons directory within the public folder
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
		origin: (origin, cb) => {
			// Allow requests from localhost, a specific domain, or server-side requests (no origin)
			if (!origin
				|| /^https?:\/\/localhost(:\d+)?$/.test(origin)
				|| (process.env.CORS_ORIGIN && origin === process.env.CORS_ORIGIN)) {
				cb(null, true)
				return
			}
			cb(new Error('Not allowed'), false)
		}
	} as FastifyCorsOptions
}
