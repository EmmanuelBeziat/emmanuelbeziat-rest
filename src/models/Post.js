import ModelHandler from '../classes/ModelHandler.js'

class Post extends ModelHandler {
	constructor () {
		super(process.env.POSTS)
	}

	/**
   * Reads the content of a marked file and returns its components
   * @param {Object} marked parsed marked files with metadata
   * @returns {Object}
   */
  readFileContent (marked) {
    return {
      title: marked.meta.title,
      slug: marked.slug,
      image: marked.meta.image || '',
      date: marked.meta.date || new Date(),
      tags: marked.meta.tags || [''],
      categories: marked.meta.categories || ['non-classe'],
      description: marked.meta.description || '',
      publish: marked.meta.publish === false ? false : true,
      markdown: marked.markdown || '',
      markup: marked.html || ''
    }
  }
}

export default new Post()
