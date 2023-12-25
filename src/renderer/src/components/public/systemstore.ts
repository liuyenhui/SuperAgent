import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * System Store
 */
const InfoData: System.Info = {
  Email: 'liuyenhui@gamil.com',
  OpenAiToken: '',
  AppVersion: '',
  Name: 'liuhui',
  EndPoint: '',
  Language: 'en'
}

interface SystemInfoStoreType {
  info: System.Info
  update: (name: string, value: string | number) => void
}
// 通过属性名,修改属性值
export const SystemInfoStore = create<SystemInfoStoreType>()(
  persist(
    (set) => ({
      info: InfoData,
      // 更新属性
      update: async (name, value): Promise<void> =>
        set(() => {
          // InfoData[name] = value 以下代码 [name]:value 替代
          return {
            // info:InfoData 无效    展开的目的是复制Info 触发改变
            info: {
              ...InfoData,
              [name]: value
            }
          }
        })
    }),
    {
      name: 'systeminfo'
    }
  )
)

// 测试 email,以下代码未使用
interface SystemEmailType {
  Emal: string
  AssistantID: string
  LeftHidden: boolean
  Loading: boolean
  updateEmail: (Email: string) => void
  updateAssistantID: (AssistantID: string) => void
  updateLeftHidden: () => void
  updateLeftLoading: () => void
}

export const SystemStore = create<SystemEmailType>()((set) => ({
  Emal: 'liuyenhui@sina.com',
  AssistantID: '',
  LeftHidden: false,
  Loading: true,
  updateEmail: async (Email: string): Promise<void> => set(() => ({ Emal: Email })),
  updateAssistantID: async (assistantid: string): Promise<void> =>
    set(() => ({ AssistantID: assistantid })),
  updateLeftHidden: async (): Promise<void> => set((state) => ({ LeftHidden: !state.LeftHidden })),
  updateLeftLoading: async (): Promise<void> => set((state) => ({ Loading: !state.Loading }))
}))
