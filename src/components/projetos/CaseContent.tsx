import { MDXRemote, type MDXRemoteProps } from 'next-mdx-remote/rsc'
import Mermaid from './Mermaid'

interface CaseContentProps {
  content: string
}

export default function CaseContent({ content }: CaseContentProps) {
  return (
    <article className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-orange-500">
      <MDXRemote
        source={content}
        components={{
          pre: ({ children, ...props }: any) => {
            const child = Array.isArray(children) ? children[0] : children
            if (child?.props?.className === 'language-mermaid') {
              return <Mermaid chart={child.props.children as string} />
            }
            return <pre {...props}>{children}</pre>
          },
          code: ({ className, children, ...props }: any) => {
            if (className === 'language-mermaid') {
              return null
            }
            return <code className={className} {...props}>{children}</code>
          },
        }}
      />
    </article>
  )
}
