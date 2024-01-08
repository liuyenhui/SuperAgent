/**
 * 订阅Store更新事件 更新数据内容,如SetingStore 更新Key 则初始化Assistants
 */
import { SetingStore, KeyState, LockInit, UnLockInit } from './setingstore'

import { AssistantsStore } from './assistantstore'
import log from 'electron-log'
import { Snackbar } from '@mui/joy'
import { useEffect, useState } from 'react'
import { UpdateSysinfo } from './systemstore'
import { InsertThread } from './messagestore'

export function SubscribeStore(): JSX.Element {
  const [open, setOpen] = useState(false)
  const [errormsg, setErrormsg] = useState('')
  const UpdateAssistants = AssistantsStore((state) => state.UpdateAssistants)

  useEffect(() => {
    SetingStore.subscribe(
      (state) => state.UserState,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (value, prev) => {
        // 设置api key成功,设置代理 // 锁住初始化,防止多少渲染调用

        if (value == KeyState.Setkey && prev == KeyState.None && LockInit()) {
          InitAssistentOpenAI()
            .then((assistants) => {
              UpdateAssistants(assistants)
              // 设置默认AssistantID
              const ids = Array.from(assistants.keys())
              UpdateSysinfo('AssistantID', ids[0])
            })
            .then(() => {
              // 初始化消息
              MessageInit()
            })
            .catch((errmsg) => {
              setErrormsg(errmsg)
              setOpen(true)
            })

          //
        }
        if (value == KeyState.None) console.log(`set key error`)
      }
    )
  }, [])

  return (
    <Snackbar
      autoHideDuration={30000}
      onClose={() => setOpen(false)}
      open={open}
      color="danger"
      variant="soft"
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
    >
      {errormsg}
    </Snackbar>
  )
}
// 在OpenAI服务器创建助理
function InitAssistentOpenAI(): Promise<System.Assistants> {
  const keypackage = {
    key: SetingStore.getState().OpenAiAPIKey,
    url: SetingStore.getState().BaseURL,
    assistants: AssistantsStore.getState().Assistants
  }

  return window.electron.ipcRenderer
    .invoke('invoke_init_assistants', keypackage)
    .then((assistants) => {
      // 成功创建助手,合并store
      console.log(assistants)
      return Promise.resolve(assistants)
    })
    .catch((error) => {
      const msg = `InitAssistantOpenAI error:${error}`
      log.info(msg)
      return Promise.reject(msg)
    })
    .finally(() => {
      UnLockInit()
    })
}

function MessageInit(): void {
  const assistants = AssistantsStore.getState().Assistants
  assistants.forEach((assistant) => {
    const thread_id = assistant.AssistantBase.MetaData['thread_id']
    window.electron.ipcRenderer
      .invoke('invoke_thread_message_list', {
        thread_id: thread_id,
        before_message_id: undefined
      })
      .then((thread: System.ThreadType) => {
        // 插入线程
        InsertThread(thread.thread_id, thread.messages)
      })
      .catch((error) => {
        // PostMessage(error)
        console.log(error)
      })
  })
}

// function Respone(assisstants): void {
//   log.info(assisstants)
// }
