import { MDXRemote } from 'next-mdx-remote/rsc'
import type { MDXRemoteProps } from 'next-mdx-remote/rsc'
import Mermaid from './Mermaid'

interface CaseContentProps {
  content: string
}

export default function CaseContent({ content }: CaseContentProps) {
  const components: MDXRemoteProps['components'] = {
    pre: ({ children, ...props }: React.ComponentProps<'pre'>) => {
      const child = Array.isArray(children) ? children[0] : children
      if (child && typeof child === 'object' && 'props' in child && child.props?.className === 'language-mermaid') {
        return <Mermaid chart={child.props.children as string} />
      }
      return <pre {...props}>{children}</pre>
    },
    code: ({ className, children, ...props }: React.ComponentProps<'code'>) => {
      if (className === 'language-mermaid') {
        return null
      }
      return <code className={className} {...props}>{children}</code>
    },
  }

  return (
    <article className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-orange-500">
      <MDXRemote source={content} components={components} />
    </article>
  )
}
