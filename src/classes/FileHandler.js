import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import { sanitizeUrl } from '@braintree/sanitize-url'
import metaMarked from 'meta-marked'
import Markdown from './Markdown.js'

class FileHandler {
  constructor(folder, filePrefix) {
    this.folder = folder
    this.filePrefix = filePrefix
  }

	/**
	 * slugName
	 * @param {string} fileName
	 * @returns string
	 */
	slugName (fileName) {
		return fileName.replace(/\.[^/.]+$/, '').slice(11)
	}

  getAllFiles() {
    const fileContent = []

    return new Promise((resolve, reject) => {
      fs.readdir(path.resolve(this.folder), 'utf8', (error, files) => {
        if (error) {
          reject('No folder found.')
          return
        }

        if (!files.length) {
          reject('No files in folder')
          return
        }

        files?.forEach(file => {
          const fileContentItem = this.readFileContent(file)
          fileContent.unshift(fileContentItem)
        })

        resolve(fileContent)
      })
    })
  }

  async getFile(param, options) {
    const slug = this.sanitize(param)

    const queries = {
      markup: options.type == undefined ? true : options.type.split(',').includes('markup') ? true : false,
      markdown: options.type == undefined ? false : options.type.split(',').includes('markdown') ? true : false
    }

    try {
      const files = await glob(`${this.folder}/*${slug}.md`)

      if (!files.length) {
        throw new Error('No data found.')
      }

      const file = await fs.promises.readFile(files[0], 'utf8')
      const marked = metaMarked(file)
      const html = Markdown.renderMarkdown(marked.markdown)

      const fileContent = {
        slug,
        markdown: queries.markdown ? marked.markdown || '' : undefined,
        markup: queries.markup ? html || '' : undefined,
      }

      return fileContent
    }
		catch (error) {
      throw new Error('No data found.')
    }
  }

  sanitize (string) {
    return sanitizeUrl(string)
  }

  readFileContent (file) {
    // To be implemented in the subclasses
    throw new Error('Not implemented.')
  }
}

export default FileHandler
