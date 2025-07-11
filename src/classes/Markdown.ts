import slug from 'slug'
import MarkdownIt from 'markdown-it';
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
	private md: MarkdownIt

	constructor () {
		const markdownItOptions: MarkdownIt.Options = {
			html: true,
			breaks: true,
			langPrefix: 'language-',
			typographer: true
		}

		const blockEmbedOptions = {
			containerClassName: 'video',
			serviceClassPrefix: 'video--',
			outputPlayerSize: false,
			allowFullScreen: true
		}

		const anchorOptions = {
			permalink: MarkdownItAnchor.permalink.headerLink({
				symbol: `<span class="anchor">🔗 <span class="visually-hidden">Permalien</span></span>`
			}),
			slugify: (value: string) => slug(value).toLowerCase()
		}

		const md = new MarkdownIt(markdownItOptions)
			.use(MarkdownItAttrs)
			.use(MarkdownItLazyLoading)
			.use(MarkdownItBlockEmbed, blockEmbedOptions)
			.use(MarkdownItAnchor, anchorOptions)
			.use(MarkdownItPrism)
			.use(MarkdownItSmartArrows)

		this.md = md
	}

	/**
	 * Renders the given markdown string to HTML
	 * @param {string} value Markdown string to be rendered
	 * @returns {string} Rendered HTML string
	 */
	renderMarkdown (value: string): string {
		return this.md.render(value)
	}
}

export default new Markdown()
