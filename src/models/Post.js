import fs from 'fs'
import path from 'path'
import metaMarked from 'meta-marked'
import Markdown from '../classes/Markdown.js'
import FileHandler from '../classes/FileHandler.js'

class Post extends FileHandler {
	constructor () {
		super(process.env.POSTS)
	}

  readFileContent(file) {
    const post = fs.readFileSync(path.resolve(this.folder, file), 'utf8')
    const marked = metaMarked(post)
    const html = Markdown.renderMarkdown(marked.markdown)

    return {
      title: marked.meta.title,
      slug: this.slugName(file),
      image: marked.meta.image || '',
      date: marked.meta.date || new Date(),
      tags: marked.meta.tags || [''],
      categories: marked.meta.categories || ['non-classe'],
      description: marked.meta.description || '',
      publish: marked.meta.publish === false ? false : true,
      markdown: marked.markdown || '',
      markup: html || ''
    }
  }
}

export default new Post()
