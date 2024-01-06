import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * System Store
 */

interface SystemInfoStoreType {
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

const InfoData: SystemInfoStoreType = {
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

// 通过属性名,修改属性值
export const SystemInfoStore = create<SystemInfoStoreType>()(
  persist(() => InfoData, {
    name: 'systeminfo',
    partialize: (state) =>
      Object.fromEntries(Object.entries(state).filter(([key]) => !['PopMessage'].includes(key)))
  })
)

export const UpdateSysinfo = (name: string, value: unknown): void => {
  SystemInfoStore.setState((store) => ({
    ...store,
    [name]: value
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

    PopMessage: {
      Msg: Msg,
      Open: Open,
      Color: Color,
      Variant: Variant,
      Vertical: Vertical,
      Horizontal: Horizontal
    }
  }))
}

export const CloseMessage = (): void => {
  SystemInfoStore.setState((store) => ({
    ...store,
    PopMessage: {
      ...store.PopMessage,
      Open: false
    }
  }))
}
