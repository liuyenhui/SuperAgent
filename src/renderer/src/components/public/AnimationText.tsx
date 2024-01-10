import { useEffect, useRef, useState } from 'react'
/**
 * 文字动画,使用定时器显示文本
 * @param props
 * @returns
 */
export function AnimationText(props: { text: string; stop: boolean; loop: boolean }): JSX.Element {
  const [text, setText] = useState('')
  const divref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    let index = 0
    const intervalid = setInterval(() => {
      if (props.stop) {
        clearInterval(intervalid)
      }
      console.log
      setText(props.text.substring(0, index))
      index++
      if (props.loop && index > props.text.length) {
        index = 0
      }
      if (!props.loop && index > props.text.length) {
        clearInterval(intervalid)
      }
    }, 300)
    return () => {
      console.log('clear... intervalid')
      clearInterval(intervalid)
    }
  }, [])
  return (
    <>
      <span
        ref={divref}
        style={{
          whiteSpace: 'nowrap',
          position: 'fixed',
          top: '0',
          left: '0',
          display: 'block',
          visibility: 'hidden'
        }}
      >
        {props.text}
      </span>
      <span style={{ width: divref.current?.clientWidth, height: divref.current?.clientHeight }}>
        {text}
      </span>
    </>
  )
}
