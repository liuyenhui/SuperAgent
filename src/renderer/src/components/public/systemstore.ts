import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * System Store
 */

interface SystemInfoType {
  Email: string
  OpenAiToken: string
  AppVersion: string
  // 当前应用的AssistantID
  AssistantID: string
  Name: string
  EndPoint: string
  Language: string
  LeftHidden: boolean
  Loading: boolean
  OpenAIConnected: boolean
  OpenAIBaseURL: string
  OpenAIBalance: number
  // 全局提示消息
  PopMessage: {
    Msg: string
    Open: boolean
    Color: string
    Variant: string
    Vertical: string
    Horizontal: string
  }
}

const InfoData: SystemInfoType = {
  Email: 'liuyenhui@gamil.com',
  OpenAiToken: '',
  AppVersion: '',
  AssistantID: '',
  Name: 'liuhui',
  EndPoint: '',
  Language: 'en',
  LeftHidden: false,
  Loading: true,
  OpenAIConnected: false,
  OpenAIBaseURL: '',
  OpenAIBalance: 0,
  PopMessage: {
    Msg: '',
    Open: false,
    Color: 'danger',
    Variant: 'soft',
    Vertical: 'top',
    Horizontal: 'left'
  }
}

interface SystemInfoStoreType {
  info: SystemInfoType
  // update: (name: string, value: string | number | boolean) => void
}

// 通过属性名,修改属性值
export const SystemInfoStore = create<SystemInfoStoreType>()(
  persist(() => ({ info: InfoData }), {
    name: 'systeminfo'
    // ,partialize: (state) => ({
    //   ...state,
    //   info: {
    //     ...state.info,
    //     PopMessage: {}
    //   }
    // })
    // Object.fromEntries(
    //   Object.entries(state.info.PopMessage).filter(([key]) => !['Open'].includes(key))
    // )
  })
)

export const UpdateSysinfo = (name: string, value: unknown): void => {
  SystemInfoStore.setState((store) => ({
    ...store,
    info: {
      ...store.info,
      [name]: value
    }
  }))
}
export const PostMessage = (
  Msg: string,
  Open: boolean = true,
  Color: string = 'danger',
  Variant: string = 'soft',
  Vertical: string = 'top',
  Horizontal: string = 'right'
): void => {
  SystemInfoStore.setState((store) => ({
    ...store,
    info: {
      ...store.info,
      PopMessage: {
        Msg: Msg,
        Open: Open,
        Color: Color,
        Variant: Variant,
        Vertical: Vertical,
        Horizontal: Horizontal
      }
    }
  }))
}

export const CloseMessage = (): void => {
  SystemInfoStore.setState((store) => ({
    ...store,
    info: {
      ...store.info,
      PopMessage: {
        ...store.info.PopMessage,
        Open: false
      }
    }
  }))
}
// update: async (name, value): Promise<void> =>
//         set((state) => {
//           // InfoData[name] = value 以下代码 [name]:value 替代
//           return {
//             // info:InfoData 无效    展开的目的是复制Info 触发改变
//             info: {
//               ...state.info,
//               [name]: value
//             }
//           }
//         })
