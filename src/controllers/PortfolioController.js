import Portfolio from '../models/Portfolio.js'
import MainController from '../classes/MainController.js'

export class PortfolioController extends MainController {
	constructor () {
		super(Portfolio)
	}
}
