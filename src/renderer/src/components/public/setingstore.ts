import { create } from 'zustand'
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
}

const SetingStoreData: SetingStoreType = {
  SetingModel: []
}

export const SetingStore = create<SetingStoreType>()(() => SetingStoreData)
