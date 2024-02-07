/**
 * 订阅Store更新事件 更新数据内容,如SetingStore 更新Key 则初始化Assistants
 */
import { SetingStore, KeyState, LockInit, UnLockInit } from './setingstore'

import { AssistantsStore, UpdateAssistants } from './assistantstore'
import log from 'electron-log'
import { useEffect } from 'react'
import { UpdateSysinfo } from './systemstore'
import { InsertThread } from './messagestore'

export function SubscribeStore(): JSX.Element {
  const keypackage = {
    key: SetingStore.getState().OpenAiAPIKey,
    url: SetingStore.getState().BaseURL,
    assistants: AssistantsStore.getState().Assistants
  }
  useEffect(() => {
    SetingStore.subscribe(
      (state) => state.UserState,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (value, prev) => {
        // 设置api key成功,设置代理 // 锁住初始化,防止多少渲染调用

        if (value == KeyState.Setkey && prev == KeyState.None) {
          InitAssistentOpenAI(keypackage)
        }
        if (value == KeyState.None) console.log(`set key error`)
      }
    )
  }, [])

  return <></>
}
// 在OpenAI服务器创建助理
async function InitAssistentOpenAI(keypackage: object): Promise<void> {
  const b = LockInit()
  if (!b) return
  window.electron.ipcRenderer
    .invoke('invoke_init_assistants', keypackage)
    .then((assistants) => {
      UpdateAssistants(assistants)
      const ids = Array.from(assistants.keys())
      UpdateSysinfo('AssistantID', ids[0])
      // 成功创建助手,合并store
      console.log(assistants)
    })
    .then(() => {
      MessageInit()
    })
    .catch((error) => {
      const msg = `InitAssistantOpenAI error:${error}`
      log.info(msg)
      return
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
      .then((messages: Array<System.Message>) => {
        // 插入线程
        InsertThread(thread_id, messages)
      })
      .catch((error) => {
        alert(error)
      })
  })
}

// function Respone(assisstants): void {
//   log.info(assisstants)
// }
