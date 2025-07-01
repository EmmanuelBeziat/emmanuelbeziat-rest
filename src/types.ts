export interface MarkedFile {
  slug: string
  markdown: string
  html: string
  meta: {
    title: string
    image?: string
    date?: Date
    tags?: string[]
    color?: string
    clients?: string[]
    categories?: string[]
    description?: string
    publish?: boolean
  }
}
