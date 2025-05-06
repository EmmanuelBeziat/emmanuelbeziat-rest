import path from 'path'
import { fileURLToPath } from 'url'

// Simulate __dirname in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const config = {
	host: process.env.HOST || '127.0.0.1',
	port: process.env.PORT || 3000,
	paths: {
		// Path to the public directory
		public: path.resolve(__dirname, '../public'),

		// Path to the favicons directory within the public folder
		favicons: path.resolve(__dirname, '../public/favicons')
	},
	cors: {
		origin: (origin, cb) => {
			// Allow requests from localhost or a specific domain
			if (/localhost/.test(origin) || origin === process.env.CORS_ORIGIN) {
				cb(null, true)
				return
			}
			cb(new Error('Not allowed'))
		}
	}
}
