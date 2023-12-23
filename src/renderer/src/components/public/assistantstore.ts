import { create } from 'zustand'
// import log from 'electron-log/renderer'
/**
 * Assistant Store
 */
interface AssistantsStoreType {
  Assistants: System.Assistants
  // 从文件读取, assistant.AssistantBase 代表一个文件的内容
  InsertAssistant: (assistant: System.Assistant) => void
  // 读取消息
  LoadMessages: (AssistantID: string) => void
  // 读取附加问件
  LoadCloudFiles: (AssistantID: string) => void
  // 读取Function
  LoadFunction: (AssistantID: string) => void
}

// const AssisantsData = new Map<string, System.Assistant>()

export const AssistantsStore = create<AssistantsStoreType>()((set) => ({
  Assistants: new Map<string, System.Assistant>(),

  InsertAssistant: async (assistant: System.Assistant): Promise<void> =>
    set((state) => ({
      Assistants: new Map<string, System.Assistant>(state.Assistants).set(
        assistant.AssistantBase.AssistantID as string,
        assistant
      )
    })),

  // set((state) => {
  //   state.Assistants.set(assistant.AssistantBase.AssistantID as string, assistant)
  //   log.info(
  //     `inst assistant AssistantID:=${assistant.AssistantBase.AssistantID} Name:${assistant.AssistantBase.Name}`
  //   )
  //   return {
  //     Assistants: { ...state.Assistants }
  //   }
  // })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  LoadMessages: (_assistantid): void => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  LoadCloudFiles: (_assistantid): void => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  LoadFunction: (_assistantid): void => {}
}))

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
