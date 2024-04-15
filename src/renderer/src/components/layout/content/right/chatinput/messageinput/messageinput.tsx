import { Divider, Sheet, Stack, Textarea } from '@mui/joy'
import { useState } from 'react'
import { RIGHT_INPUT_HEIGHT } from '@renderer/components/public/constants'

import { MessageSendFile } from './messagesendfile'
import { MessageSend } from './messagesend'
import { FileObject } from '@renderer/components/public/filestore'
export default function MessageInput(props: {
  assistant: System.Assistant | undefined
}): JSX.Element {
  const assistant = props.assistant
  const [value, setValue] = useState('')
  return (
    <Textarea
      placeholder={`Hi i\`m ${assistant?.AssistantBase.Name},Do you have any questions?`}
      // 当助手未连接时不可编辑
      disabled={assistant == undefined || assistant.AssistantBase.Disabled}
      minRows={3}
      maxRows={3}
      value={value}
      // 监听事件同步更改value状态
      onChange={(e) => setValue(e.target.value)}
      // onKeyDown={(_event) => {
      //   // console.log(event.key)
      // }}
      sx={{
        /// <reference path="" />

        width: '100%',
        height: RIGHT_INPUT_HEIGHT
      }}
      // value={msg}
      endDecorator={
        <BottomBar
          {...props}
          setvalue={setValue}
          msg={value}
          thread_id={assistant?.AssistantBase.MetaData['thread_id']}
          assistant_id={assistant?.AssistantBase.AssistantID}
        ></BottomBar>
      }
    />
  )
}
function BottomBar(props: {
  msg: string
  thread_id: string
  assistant_id: string | undefined
  setvalue: (value: string) => void
}): JSX.Element {
  const [messagefiles, setMessagefiles] = useState(new Array<FileObject>())

  return (
    <Sheet sx={{ width: '100%', maxWidth: '100%' }}>
      <Divider sx={{ width: '100%' }} />

      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={0.5}>
        <MessageSendFile
          thread_id={props.thread_id}
          assistant_id={props.assistant_id}
          messagefiles={messagefiles}
          setMessagefiles={setMessagefiles}
        ></MessageSendFile>
        {/* 发送消息 */}
        <MessageSend
          msg={props.msg}
          thread_id={props.thread_id}
          assistant_id={props.assistant_id}
          setvalue={props.setvalue}
          messagefiles={messagefiles}
          setMessagefiles={setMessagefiles}
        ></MessageSend>
      </Stack>
    </Sheet>
  )
}
