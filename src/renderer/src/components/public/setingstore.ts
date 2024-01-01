import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { subscribeWithSelector } from 'zustand/middleware'

// AI模型类型
interface SetingModelType {
  id: string
  object: string
  created: string
  owned_by: string
  name: string
  use: boolean
  type: string //'LLM' GPT 'IMG' DELL-E 'VIDO' whisper
}
// 用户API key 及登录状态
export enum KeyState {
  None,
  Setkey,
  Login
}
interface SetingStoreType {
  SetingModel: Array<SetingModelType>
  UserState: KeyState
  OpenAiAPIKey: string
  BaseURL: string
  OpenSetDialog: boolean
  LockInitAssistants: boolean
}

const SetingStoreData: SetingStoreType = {
  SetingModel: [],
  UserState: KeyState.None,
  OpenAiAPIKey: '',
  BaseURL: '',
  OpenSetDialog: false,
  LockInitAssistants: false
}

export const SetingStore = create<SetingStoreType>()(
  persist(immer(subscribeWithSelector(() => SetingStoreData)), {
    name: 'seting',
    partialize: (state) => ({ OpenAiAPIKey: state.OpenAiAPIKey, BaseURL: state.BaseURL })
  })
)

export const SetOpenDialogState = (state: boolean): void =>
  SetingStore.setState((store) => ({
    ...store,
    OpenSetDialog: state
  }))

export const SetAppState = (keystate: KeyState): void =>
  SetingStore.setState((store) => ({
    ...store,
    UserState: keystate
  }))

export const SetOpenAiApiKey = (apikey: string): void =>
  SetingStore.setState((store) => ({
    ...store,
    OpenAiAPIKey: apikey
  }))

export const SetBaseURL = (baseurl: string): void =>
  SetingStore.setState((store) => ({
    ...store,
    BaseURL: baseurl
  }))
export const SetModels = (models: object): void => {
  console.log(models)
  const data: Array<object> = models['data']
  const select = data.filter((value) => {
    const id = value['id']
    if (id == 'gpt-3.5-turbo-0613') {
      value['name'] = 'GPT 3.5'
      value['type'] = 'LLM'
      return true
    }
    if (id == 'gpt-4-1106-preview') {
      value['name'] = 'GPT 4.0'
      value['type'] = 'LLM'
      return true
    }
    return false
  })

  SetingStore.setState((store) => ({
    ...store,
    SetingModel: select
  }))
}

export const LockInit = (): boolean => {
  if (SetingStore.getState().LockInitAssistants) return false
  SetingStore.setState((store) => ({
    ...store,
    LockInitAssistants: true
  }))
  return true
}

export const UnLockInit = (): void =>
  SetingStore.setState((store) => ({
    ...store,
    LockInitAssistants: false
  }))
