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
  // 从文件读取, assistant.AssistantBase 代表一个文件的内容
  InsertAssistant: (assistant: System.Assistant) => void
  // 修改 CodeInterpreter
  UpdateAssistantCodeInterpreter: (AssistantID: string) => void
  // 读取消息
  LoadMessages: (AssistantID: string) => void
  // 读取附加问件
  LoadCloudFiles: (AssistantID: string) => void
  // 读取Function
  LoadFunction: (AssistantID: string) => void
}

export const AssistantsStore = create<AssistantsStoreType>()(
  persist(
    immer((set) => ({
      Assistants: new Map<string, System.Assistant>(),

      InsertAssistant: async (assistant: System.Assistant): Promise<void> =>
        set((state) => ({
          Assistants: new Map<string, System.Assistant>(state.Assistants).set(
            assistant.AssistantBase.AssistantID as string,
            assistant
          )
        })),
      UpdateAssistantCodeInterpreter: (AssistantID: string): void =>
        set((state) => {
          const assistant = state.Assistants.get(AssistantID)
          assistant
            ? (assistant.AssistantBase.CodeInterpreter = !assistant.AssistantBase.CodeInterpreter)
            : null
          // 存储
        }),

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      LoadMessages: (_assistantid): void => {},
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      LoadCloudFiles: (_assistantid): void => {},
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      LoadFunction: (_assistantid): void => {}
    })),
    {
      name: 'assistants',
      storage
    }
  )
)
