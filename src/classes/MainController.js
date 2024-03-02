class MainController {
  constructor (model) {
    this.model = model
  }

  index (req, reply) {
    this.model.getAllFiles()
      .then(data => reply.send(data))
      .catch(err => reply.code(404).send(err))
  }

  single (req, reply) {
    this.model.getFile(req.params.slug, { ...req.query })
      .then(data => reply.send(data))
      .catch(err => reply.code(404).send(err))
  }
}

export default MainController
