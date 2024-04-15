import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'
import { Chip, Stack, Typography } from '@mui/joy'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PostMessage } from '@renderer/components/public/systemstore'
import log from 'electron-log/renderer'
import { UpdateAssistantMessageState } from '@renderer/components/public/assistantstore'
import {
  // GetMessagesFormLocalID,
  InsertMessage,
  MessageStore,
  ReplaceMessage
  // SetMessageSteps
} from '@renderer/components/public/messagestore'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { FileObject } from '@renderer/components/public/filestore'
export function MessageSend(props: {
  msg: string
  thread_id: string
  assistant_id: string | undefined
  setvalue: (value: string) => void
  messagefiles: Array<FileObject>
  setMessagefiles: (filse: Array<FileObject>) => void
}): JSX.Element {
  // 提交响应函数
  const submit = useCallback((): void => {
    console.log(props.msg)
    // PostMessage(props.msg)
    // open ai user message
    if (props.assistant_id === undefined) {
      PostMessage('not found assistant!')
      return
    }
    props.setvalue('')
    // 更新助手发送消息状态
    UpdateAssistantMessageState(props.assistant_id, 'UserSend')
    const msglocalid = uuidv4()
    const message: System.Message = {
      id: msglocalid,
      object: '',
      created_at: moment.now() / 1000,
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
      // 写入文件id
      file_ids: [...props.messagefiles.map((file) => file.id)],
      // 记录状态,与本地临时ID
      metadata: { MessageState: 'UserSend', LocalID: msglocalid as string, Steps: undefined }
    }
    // 清空文件ID
    props.setMessagefiles([])
    // 插入用户临时消息等待返回,invoke_thread_message_create返回后更新
    InsertMessage(props.thread_id, message)
    const threads = MessageStore.getState().threads
    console.log(threads)
    window.electron.ipcRenderer
      .invoke('invoke_thread_message_create', {
        thread_id: props.thread_id,
        msg: message,
        assistant_id: props.assistant_id,
        file_ids: []
      })
      .then((result) => {
        console.log(`invoke_thread_message_create ipc result${result}`)
      })
      .catch((error) => {
        PostMessage(error)
      })
      .finally(() => {
        props.assistant_id ? UpdateAssistantMessageState(props.assistant_id, 'None') : null
      })
  }, [props])
  const { t } = useTranslation()
  // load did finish
  useEffect(() => {
    // open ai 返回用户创建的消息
    window.electron.ipcRenderer.on('message_created_user_result', (_event, arge) => {
      const message = arge as System.Message
      log.info(`recv message_created_user_result messages:${JSON.stringify(message)}`)
      // arge 返回消息
      ReplaceMessage(message.thread_id, message)
    })
    // 助手消息创建,此时创建run,等待run完成
    window.electron.ipcRenderer.on('message_created_assistant', (_event, arge) => {
      const message = arge as System.Message
      log.info(`recv message_created_assistant arge(message):${JSON.stringify(message)} `)

      // arge 返回消息
      InsertMessage(message.thread_id, message)
      console.log(arge)
    })
    // 助手消息返回,此时run状态completed
    window.electron.ipcRenderer.on('message_result_assistant', (_event, arge) => {
      const message = arge as System.Message
      log.info(`recv message_result_assistant ${JSON.stringify(message)}`)

      // arge 返回消息
      ReplaceMessage(message.thread_id, message)
      const messages = MessageStore.getState().threads.find((thread) => {
        return thread.thread_id == message.thread_id
      })
      log.info(messages)
    })
  }, [])
  return (
    <Chip
      variant="plain"
      color="primary"
      size="sm"
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
  )
}
