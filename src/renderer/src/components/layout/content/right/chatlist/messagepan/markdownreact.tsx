import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import directive from 'remark-directive'
import { visit, VisitorResult } from 'unist-util-visit'
import { Node } from 'unist'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula as codeStyle } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import './markdown.css'
import { IconButton, Sheet, Tooltip } from '@mui/joy'
import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'
import { useState } from 'react'
function reactMarkdownRemarkDirective() {
  return (tree: Node): VisitorResult => {
    visit(
      tree,
      (node): boolean => {
        return node.type == 'link'
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // (node, index, parent) => {
      (node) => {
        // 地址存储到title中 sandbox:/mnt/data/beijing_districts.csv 无效地址解析会删除
        node['title'] = node['url']
        return node as never
      }
    )
  }
}
type ILinkProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>

const LinkComponent = (props: ILinkProps, message: System.Message | undefined): JSX.Element => {
  const { children, title } = props
  return (
    <a
      href={title as string}
      onClick={() => {
        // title 不是sandbox开头,表示非文件下载
        const match = title && /^sandbox:.*/.test(title)
        if (!match || !message) {
          return
        }

        // 返回消息的所有注释
        const files = new Array<System.FilePath>()
        message.content.map((content) => {
          if (content.type == 'text' && content.text.annotations.length > 0) {
            content.text.annotations.map((item) => {
              if (item.type == 'file_path') {
                files.push(item)
              }
              return null
            })
          }
          return null
        })
        const filepath = files.find((file) => {
          return file.text == title
        })
        if (!filepath) {
          alert(`no found file id from ${title}`)
          return
        }
        window.electron.ipcRenderer.invoke('invoke_message_file_download', {
          file_id: filepath.file_path.file_id,
          file_text: filepath.text
        })
      }}
    >
      {children as string}
    </a>
  )
}

function Copied(props: { copytext: string }): JSX.Element {
  const { copytext } = props
  const [opentip, setOpentip] = useState(false)
  let timeid
  return (
    <Tooltip title="Copied!" placement="top" open={opentip} variant="plain">
      <IconButton
        size="sm"
        sx={{ cursor: 'pointer', mt: '10px', mr: '10px', position: 'absolute', top: 0, right: 0 }}
        onClick={async () => {
          await navigator.clipboard.writeText(copytext)
          setOpentip(true)
          if (!timeid) {
            timeid = setTimeout(() => {
              clearTimeout(timeid)
              timeid = false
              setOpentip(false)
            }, 2000)
          }
        }}
      >
        <SvgIcons d={SvgPathMap.Copy}></SvgIcons>
      </IconButton>
    </Tooltip>
  )
}
function CodeHighlight(props): JSX.Element {
  const { className, inline, children } = props
  const match = /language-(\w+)/.exec(className || '')
  let widget
  const classes = `${className} `
  if (!inline && match) {
    widget = (
      <Sheet>
        <Copied copytext={children}></Copied>
        <SyntaxHighlighter
          style={codeStyle}
          language={match[1]}
          className={classes}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </Sheet>
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

export function MarkDown(props: {
  marktext: string
  message?: System.Message | undefined
}): JSX.Element {
  const { marktext, message } = props

  const LinkDown = (props: ILinkProps): JSX.Element => {
    return message ? LinkComponent(props, message) : <></>
  }
  const componenets = {
    // a: LinkComponent,
    a: LinkDown,
    code: CodeHighlight
  }

  return (
    <div className="App">
      <Markdown
        remarkPlugins={[directive, reactMarkdownRemarkDirective, remarkGfm]}
        components={componenets}
      >
        {marktext}
      </Markdown>
    </div>
  )
}
