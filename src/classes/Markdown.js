import slug from 'slug'
import MarkdownIt from 'markdown-it'
import MarkdownItPrism from 'markdown-it-prism'
import MarkdownItAttrs from 'markdown-it-attrs'
import MarkdownItBlockEmbed from 'markdown-it-block-embed'
import MarkdownItAnchor from 'markdown-it-anchor'
import MarkdownItSmartArrows from 'markdown-it-smartarrows'
import MarkdownItLazyLoading from 'markdown-it-image-lazy-loading'

import 'prismjs/components/prism-php.min.js'
import 'prismjs/components/prism-markdown.min.js'
import 'prismjs/components/prism-pug.min.js'
import 'prismjs/components/prism-markup-templating.min.js'

class Markdown {
	constructor () {
		const markdownItOptions = {
			html: true,
			breaks: true,
			langPrefix: 'language-',
			typographer: true
		}
		const MarkdownItBlockEmbedOptions = {
			containerClassName: 'video',
			serviceClassPrefix: 'video--',
			outputPlayerSize: false,
			allowFullScreen: true
		}
		const MarkdownItAnchorOptions = {
			permalink: true,
			slugify: value => slug(value).toLowerCase(),
			permalinkClass: 'post__anchor',
			permalinkSymbol: '🔗'
		}

		const md = new MarkdownIt(markdownItOptions)
		md.use(MarkdownItAttrs)
		md.use(MarkdownItLazyLoading)
		md.use(MarkdownItBlockEmbed, MarkdownItBlockEmbedOptions)
		md.use(MarkdownItAnchor, MarkdownItAnchorOptions)
		md.use(MarkdownItPrism)
		md.use(MarkdownItSmartArrows)

		this.md = md
	}

	renderMarkdown (value) {
		return this.md.render(value)
	}
}

export default new Markdown()
