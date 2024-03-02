import fs from 'fs'
import path from 'path'
import metaMarked from 'meta-marked'
import Markdown from '../classes/Markdown.js'
import FileHandler from '../classes/FileHandler.js'

class Code extends FileHandler {
	constructor () {
		super(process.env.CODES, 'code-')
	}

	/**
	 * slugName
	 * @param {string} fileName
	 * @returns string
	 */
	slugName (fileName) {
		return fileName.replace(/\.[^/.]+$/, '')
	}

	readFileContent(file) {
    const code = fs.readFileSync(path.resolve(this.folder, file), 'utf8')
    const marked = metaMarked(code)
    const html = Markdown.renderMarkdown(marked.markdown)

    return {
      slug: this.slugName(file),
      markdown: marked.markdown || '',
      markup: html || ''
    }
  }
}

export default new Code()
