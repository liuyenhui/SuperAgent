import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'
import { Box, Chip, Stack, Textarea, Typography } from '@mui/joy'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RIGHT_INPUT_HEIGHT } from '@renderer/components/public/constants'
import { PostMessage } from '@renderer/components/public/systemstore'
import { AssistantsStore } from '@renderer/components/public/assistantstore'
import {
  InsertMessage,
  MessageStore,
  ReplaceMessage
} from '@renderer/components/public/messagestore'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
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
      // 监听事件同步更改value状态
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(event) => {
        console.log(event.key)
      }}
      sx={{
        /// <reference path="" />

        width: '100%',
        height: RIGHT_INPUT_HEIGHT
      }}
      // value={msg}
      endDecorator={
        <BottomBar
          {...props}
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
}): JSX.Element {
  let msglocalid: string = ''
  // 提交响应函数
  const submit = (): void => {
    console.log(props.msg)
    // PostMessage(props.msg)
    // open ai user message
    const UpdateAssistantMessageState = AssistantsStore.getState().UpdateAssistantMessageState
    if (props.assistant_id === undefined) {
      PostMessage('not found assistant!')
      return
    }
    // 更新助手发送消息状态
    UpdateAssistantMessageState(props.assistant_id, 'UserSend')
    msglocalid = uuidv4()
    const message: System.Message = {
      id: msglocalid,
      object: '',
      created_at: moment.now(),
      thread_id: props.thread_id,
      role: 'user',
      content: [
        {
          type: 'text',
          text: {
            value: props.msg,
            annotations: []
          }
        }
      ],
      assistant_id: props.assistant_id,
      run_id: '',
      file_ids: [],
      // 记录状态,与本地临时ID
      metadata: { MessageState: 'UserSend', LocalID: msglocalid }
    }
    // 插入用户临时消息等待返回,Assistant返回后更新
    InsertMessage(props.thread_id, message)
    const threads = MessageStore.getState().threads
    console.log(threads)
    window.electron.ipcRenderer
      .invoke('invoke_thread_message', {
        thread_id: props.thread_id,
        msg: props.msg,
        assistant_id: props.assistant_id,
        file_ids: []
      })
      .then((resultmessage) => {
        console.log(resultmessage)
      })
      .catch((error) => {
        PostMessage(error)
      })
      .finally(() => {
        props.assistant_id ? UpdateAssistantMessageState(props.assistant_id, 'None') : null
      })
  }
  const { t } = useTranslation()
  // load did finish
  useEffect(() => {
    // open ai 返回用户创建的消息
    window.electron.ipcRenderer.on('message_created_user', (_event, arge) => {
      // arge 返回消息
      ReplaceMessage(props.thread_id, msglocalid, arge)

      console.log(arge)
    })
  }, [])
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 'var(--Textarea-paddingBlock)',
        pt: 'var(--Textarea-paddingBlock)',
        borderTop: '1px solid',
        borderColor: 'divider',
        flex: 'auto',
        alignItems: 'auto',
        justifyContent: 'center'
      }}
    >
      <Typography level="body-sm" variant="plain" color="primary" mt="5px">
        {t('chat.sendfiles')}
      </Typography>
      <Chip
        variant="plain"
        color="primary"
        size="sm"
        sx={{
          height: 'auto',
          mt: '5px',
          mb: '5px',
          ml: 'auto'
        }}
        onClick={() => {
          console.log('submit')
          // 提交
          submit()
        }}
      >
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
          <SvgIcons d={SvgPathMap.Send} sx={{ mr: '1px' }} />
          <Typography level="body-sm" variant="plain" color="primary">
            {t('chat.sendmessage')}
          </Typography>
        </Stack>
      </Chip>
    </Box>
  )
}
