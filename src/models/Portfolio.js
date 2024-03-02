import fs from 'fs'
import path from 'path'
import metaMarked from 'meta-marked'
import Markdown from '../classes/Markdown.js'
import FileHandler from '../classes/FileHandler.js'

class Portfolio extends FileHandler {
	constructor () {
		super(process.env.PORTFOLIO)
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
			color: marked.meta.color || '',
			clients: marked.meta.clients || [''],
			categories: marked.meta.categories || ['non-classe'],
			description: marked.meta.description || '',
			markdown: marked.markdown || '',
			markup: html || ''
    }
  }
}

export default new Portfolio()
