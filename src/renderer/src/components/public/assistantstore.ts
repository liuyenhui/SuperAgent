import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { enableMapSet } from 'immer'
import { persist, PersistStorage } from 'zustand/middleware'

import log from 'electron-log'
enableMapSet()

const storage: PersistStorage<AssistantsStoreType> = {
  getItem: (name) => {
    const msgname = `${name}_load`
    // 发送消息文件读取
    const resultassistents = window.electron.ipcRenderer.sendSync(msgname)
    log.info(resultassistents)
    const assistants: System.Assistants = new Map<string, System.Assistant>()
    for (const assistent of resultassistents) {
      const assistant: System.Assistant = {
        AssistantBase: assistent
      }
      // 初始时设置为true, 在invoke_init_assistants验证消息后则可以使用
      assistant.AssistantBase.Disabled = true
      log.info(assistant)

      assistants.set(assistant.AssistantBase.AssistantID as string, assistant)
    }

    // const state: StorageValue<AssistantsStoreType> = superjson.parse(str)
    return {
      state: {
        Assistants: assistants
      }
    } as never
  },
  setItem: (name, value) => {
    const msgname = `${name}_save`
    const assistants = value.state.Assistants
    const sendAssistants = Array.from(assistants.values())
    // 发送消息文件写入
    const result = window.electron.ipcRenderer.sendSync(msgname, sendAssistants)
    log.info(`result=${result},value:${value}`)
    // localStorage.setItem(name, superjson.stringify(value))
  },
  removeItem: (name) => localStorage.removeItem(name)
}

// import log from 'electron-log/renderer'
/**
 * Assistant Store
 */
interface AssistantsStoreType {
  Assistants: System.Assistants
}
const store: AssistantsStoreType = { Assistants: new Map<string, System.Assistant>() }
export const AssistantsStore = create<AssistantsStoreType>()(
  persist(
    immer(() => store),
    {
      name: 'assistants',
      storage
    }
  )
)

// 修改 助手Model ID
export const UpdateAssistantModel = (
  AssistantID: string,
  modelname: string,
  modelid: string
): void =>
  AssistantsStore.setState((store) => {
    log.info(
      `update assistant model AssistantID:${AssistantID} ModelName:${modelname} ModelID:${modelid}`
    )
    const assistant = store.Assistants.get(AssistantID)
    if (assistant) {
      assistant.AssistantBase.Model = modelid
      store.Assistants.set(AssistantID, assistant)
    }
    // 远程修改助手Model
    window.electron.ipcRenderer.invoke('invoke_update_assistant_model', {
      assistant_id: AssistantID,
      model: modelid
    })
  })
export const UpdateAssistants = (assistants: System.Assistants): void =>
  AssistantsStore.setState((state) => ({
    ...state,
    Assistants: new Map<string, System.Assistant>(assistants)
  }))
// 更新代码解释器
export const UpdateAssistantCodeInterpreter = (AssistantID: string): void =>
  AssistantsStore.setState((state) => {
    const assistant = state.Assistants.get(AssistantID)
    assistant
      ? (assistant.AssistantBase.CodeInterpreter = !assistant.AssistantBase.CodeInterpreter)
      : null
    // 远程修改代码解释器
    window.electron.ipcRenderer.invoke('invoke_update_assistant_codeinterpreter', [
      AssistantID,
      assistant?.AssistantBase.CodeInterpreter
    ])
  })
// 更新助手消息状态
export const UpdateAssistantMessageState = (
  AssistantID: string,
  State: System.SendMessageState
): void =>
  AssistantsStore.setState((state) => {
    const assistant = state.Assistants.get(AssistantID)
    assistant ? (assistant.AssistantBase.MessageState = State) : null
  })

export const UpdateAssistantThreadID = (AssistantID: string, ThreadID: string): void =>
  AssistantsStore.setState((state) => {
    const assistant = state.Assistants.get(AssistantID)
    assistant ? (assistant.AssistantBase.MetaData = { thread_id: ThreadID }) : null
  })
