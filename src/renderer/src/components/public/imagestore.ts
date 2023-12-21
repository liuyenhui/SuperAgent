// import { create } from 'zustand'


// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ImageStoreType {
  Images: System.Assistants
  // 从文件读取, assistant.AssistantBase 代表一个文件的内容
  InsertAssistant: (assistant: System.Assistant) => void
  // 读取消息
  LoadMessages: (AssistantID: string) => void
  // 读取附加问件
  LoadCloudFiles: (AssistantID: string) => void
  // 读取Function
  LoadFunction: (AssistantID: string) => void
}
