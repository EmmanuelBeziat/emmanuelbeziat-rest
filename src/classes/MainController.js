/**
 * Main routing actions
 */
class MainController {

	/**
   * @param {Object} model
   */
  constructor (model) {
    this.model = model
  }

	/**
   * Handles the index route by retrieving and sending all files in reverse order.
   * @param {Object} req The request object.
   * @param {Object} reply The reply object to send the response.
   */
  index (req, reply) {
    this.model.getAllFiles()
      .then(data => reply.send(data.reverse()))
      .catch(err => reply.code(404).send(err))
  }

	/**
   * Handles requests for a single file by slug and query parameters.
   * @param {Object} req The request object, containing parameters and query.
   * @param {Object} reply The reply object to send the response.
   */
  single (req, reply) {
    this.model.getFile(req.params.slug, { ...req.query })
      .then(data => reply.send(data))
      .catch(err => reply.code(404).send(err))
  }
}

export default MainController
