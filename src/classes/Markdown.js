import slug from 'slug'
import MarkdownIt from 'markdown-it'
import MarkdownItPrism from 'markdown-it-prism'
import MarkdownItAttrs from 'markdown-it-attrs'
import MarkdownItBlockEmbed from 'markdown-it-block-embed'
import MarkdownItAnchor from 'markdown-it-anchor'
import MarkdownItSmartArrows from 'markdown-it-smartarrows'
import MarkdownItLazyLoading from 'markdown-it-image-lazy-loading'

// PrismJS components for syntax highlighting
import 'prismjs/components/prism-php.min.js'
import 'prismjs/components/prism-markdown.min.js'
import 'prismjs/components/prism-pug.min.js'
import 'prismjs/components/prism-markup-templating.min.js'

/**
 * Markdown class to initialize and render markdown content with plugins
 */
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
			permalink: MarkdownItAnchor.permalink.linkInsideHeader({
				symbol: `<span class="post__anchor">🔗 <span class="visually-hidden">Permalien</span></span>`,
				placement: 'before'
			}),
			slugify: value => slug(value).toLowerCase()
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

	/**
	 * Renders the given markdown string to HTML
	 * @param {string} value Markdown string to be rendered
	 * @returns {string} Rendered HTML string
	 */
	renderMarkdown (value) {
		return this.md.render(value)
	}
}

export default new Markdown()
