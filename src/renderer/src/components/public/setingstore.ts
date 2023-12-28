import { create } from 'zustand'
// AI模型类型
interface SetingModelType {
  id: string
  object: string
  created: string
  owned_by: string
  name: string
  use: boolean
}

interface SetingStoreType {
  SetingModel: Array<SetingModelType>
  SetOpenAiApiKeyState: boolean
}

const SetingStoreData: SetingStoreType = {
  SetingModel: [],
  SetOpenAiApiKeyState: true
}

export const SetingStore = create<SetingStoreType>()(() => SetingStoreData)

export const GetOpenAiApiKeyState = (): boolean =>
  SetingStore((state) => state.SetOpenAiApiKeyState)

export const SetOpenAiApiKeyState = (state: boolean): void =>
  SetingStore.setState((store) => ({
    ...store,
    SetOpenAiApiKeyState: state
  }))
