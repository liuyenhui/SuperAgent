import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * System Store
 */

interface SystemInfoType {
  Email: string
  OpenAiToken: string
  AppVersion: string
  AssistantID: string
  Name: string
  EndPoint: string
  Language: string
  LeftHidden: boolean
  Loading: boolean
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
  Loading: false
}

interface SystemInfoStoreType {
  info: SystemInfoType
  update: (name: string, value: string | number | boolean) => void
}
// 通过属性名,修改属性值
export const SystemInfoStore = create<SystemInfoStoreType>()(
  persist(
    (set) => ({
      info: InfoData,
      // 更新属性
      update: async (name, value): Promise<void> =>
        set((state) => {
          // InfoData[name] = value 以下代码 [name]:value 替代
          return {
            // info:InfoData 无效    展开的目的是复制Info 触发改变
            info: {
              ...state.info,
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
