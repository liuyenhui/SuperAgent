import { ComponentPropsWithoutRef } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula as codeStyle } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Link } from '@mui/joy'
import React from 'react'
import md from 'markdown-it'
import { markdownItTable } from 'markdown-it-table'
// import hl from 'highlight.js'
import 'highlight.js/styles/docco.css'
import './markdown.css'

const markdown = md({
  html: true,
  linkify: true,
  typographer: true,
  // highlight: function (str, lang) {
  //   if (lang && hl.getLanguage(lang)) {
  //     try {
  //       return hl.highlight(lang, str, true).value
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }
  //   return '' // 使用额外的默认转义
  // }
}).use(markdownItTable)

export function MarkDown(props: { marktext: string }): JSX.Element {
  const { marktext } = props
  // const markdown = markdownItTable(md, )
  const markhtml = {
    __html: markdown.render(marktext)
  }

  return <div dangerouslySetInnerHTML={markhtml}></div>
}

type ReactMarkdownProps = {
  markdown: string & { content?: string }
}

export type CodeProps = ComponentPropsWithoutRef<'code'> &
  ReactMarkdownProps & {
    inline?: boolean
  }
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function CodeHighlight({ inline, className, children, ...props }: CodeProps) {
  const match = /language-(\w+)/.exec(className || '')
  let widget
  const classes = `${className} `
  if (!inline && match) {
    widget = (
      <SyntaxHighlighter
        language={match[1]}
        className={classes}
        PreTag="div"
        {...props}
        style={codeStyle}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    )
  } else {
    widget = (
      <code className={classes} {...props}>
        {children}
      </code>
    )
  }
  return widget
}

type ILinkProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>

export function HerfLink(props: ILinkProps): JSX.Element {
  const { children } = props
  return (
    <Link
      target="_blank"
      onClick={() => {
        console.log(children)
      }}
    >
      {children}
    </Link>
  )
}
