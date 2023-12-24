import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { enableMapSet } from 'immer'
enableMapSet()
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

// const AssisantsData = new Map<string, System.Assistant>()

export const AssistantsStore = create<AssistantsStoreType>()(
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
      }),

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    LoadMessages: (_assistantid): void => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    LoadCloudFiles: (_assistantid): void => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    LoadFunction: (_assistantid): void => {}
  }))
)

// export const insertMessage = (id:string,msg:System.Message) => useAssistentsStore.setState(
//         (state) => {
//             state.Assisants.get(id)?.AssistantData.Messages.push(msg)
//             return {Assisants:state.Assisants}
//         }

//     )

// export const getlastMessage= (id:string,msg:System.Message) => useAssistentsStore.getState(
//     (state) => {

//     }
// )
// const useAssistantsState = create<AssisantsState>((get,set)=>({
//     Assisants:Assistents,
//     AddMessage:(AssistantID:string,Message:System.Message)=>
//         set((AssisantsState)=>{
//                 AssisantsState.Assisants.get(AssistantID)?.Messages.push(Message)
//                 return AssisantsState
//             }
//         )

// }))
