import { Post } from './types'

export const META_DEFAULTS = {
  title: "Drumblow FabricApps Blog",
  description: "Articles about software development, technology and innovation",
  keywords: ["software", "development", "technology", "innovation"],
  author: "Drumblow Team"
}

export function generateMetadata(post?: Post) {
  const metadata = {
    title: post ? `${post.title} | ${META_DEFAULTS.title}` : META_DEFAULTS.title,
    description: post?.description || META_DEFAULTS.description,
    keywords: post?.tags || META_DEFAULTS.keywords,
    author: post?.author.name || META_DEFAULTS.author,
    openGraph: {
      title: post?.title || META_DEFAULTS.title,
      description: post?.description || META_DEFAULTS.description,
      type: 'article',
      authors: [post?.author.name || META_DEFAULTS.author],
      publishedTime: post?.date,
      modifiedTime: post?.date,
      tags: post?.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post?.title || META_DEFAULTS.title,
      description: post?.description || META_DEFAULTS.description,
    }
  }

  return metadata
}
