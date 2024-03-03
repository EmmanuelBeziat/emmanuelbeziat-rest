import { HomeController, PostController, CodeController, PortfolioController } from '../controllers/index.js'

/**
 * Defines application routes and their corresponding controllers.
 */
export class Router {
	constructor () {
		this.apiURL = '/'
		this.home = new HomeController()
		this.post = new PostController()
		this.code = new CodeController()
		this.portfolio = new PortfolioController()
	}

	/**
	 * Initializes routes and associates them with their respective controller actions
	 * @param {Object} app
	 */
	routes(app) {
		const opts = {
			schema: {
				querystring: {
					code: { type: 'string' },
				}
			}
		}

		app.get(this.apiURL, (req, reply) => this.home.index(req, reply))
		app.get(`${this.apiURL}posts`, (req, reply) => this.post.index(req, reply))
		app.get(`${this.apiURL}posts/:slug`, opts, (req, reply) => { this.post.single(req, reply) })
		app.get(`${this.apiURL}codes`, (req, reply) => this.code.index(req, reply))
		app.get(`${this.apiURL}codes/:slug`, opts, (req, reply) => { this.code.single(req, reply) })
		app.get(`${this.apiURL}portfolio`, (req, reply) => this.portfolio.index(req, reply))
		app.get(`${this.apiURL}portfolio/:slug`, opts, (req, reply) => { this.portfolio.single(req, reply) })
	}
}
