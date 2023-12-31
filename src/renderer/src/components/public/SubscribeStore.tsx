/**
 * 订阅Store更新事件 更新数据内容,如SetingStore 更新Key 则初始化Assistants
 */
import { SetingStore, KeyState, LockInit, UnLockInit } from './setingstore'
import { AssistantsStore } from './assistantstore'
import log from 'electron-log'
import { Snackbar } from '@mui/joy'
import { useEffect, useState } from 'react'

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

        if (value == KeyState.Setkey && prev == KeyState.None) {
          LockInit()
            ? InitAssistentOpenAI(
                (assistants) => {
                  UpdateAssistants(assistants)
                },
                (errmsg) => {
                  setErrormsg(errmsg)
                  setOpen(true)
                }
              )
            : null
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
function InitAssistentOpenAI(
  successcallback: (assistants: System.Assistants) => void,
  errorcallback: (errormsg: string) => void
): void {
  const keypackage = {
    key: SetingStore.getState().OpenAiAPIKey,
    url: SetingStore.getState().BaseURL,
    assistants: AssistantsStore.getState().Assistants
  }
  try {
    window.electron.ipcRenderer
      .invoke('invoke_init_assistants', keypackage)
      .then((assistants) => {
        // 成功创建助手,合并store
        console.log(assistants)
        successcallback(assistants)
      })
      .catch((error) => {
        const msg = `InitAssistantOpenAI error:${error}`
        log.info(msg)
        errorcallback(msg)
      })
      .finally(() => {
        UnLockInit()
      })
  } catch (error) {
    log.info(error)
  }
}

// function Respone(assisstants): void {
//   log.info(assisstants)
// }
