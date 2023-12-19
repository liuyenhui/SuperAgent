// import { Assessment } from "@mui/icons-material"

declare namespace System {
  interface Message {
    type: 'Assistant' | 'User' | 'System'
    id: string
    value: string
  }
  interface CloudFile {
    type: 'img' | 'md' | 'excel' | 'word' | 'pdf' | 'mp3' | 'py'
    id: string
    filename: string
  }
  interface AssistantData {
    AssistantID: string
    Messages: Array<Message>
    CloudFiles: Array<CloudFile>
  }
  interface AssistantBase {
    [prop: string]: string | number
  }
  interface Assistant {
    AssistantBase: AssistantBase
    AssistantData: AssistantData
  }
  // 助手集合
  type Assistants = Map<string, Assistant>

  // 任意属性名,可动态修改属性值 例如 Objece[name] = value 其中 name value均为string ,value 可为 number
  interface Info {
    [prop: string]: string | number
  }
  // interface Info{
  //     AppVersion:string
  //     OpenAiToken:string
  //     EndPoint:string
  //     Email:string
  //     Name:string
  // }
}
