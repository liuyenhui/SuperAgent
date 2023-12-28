// import { Assessment } from "@mui/icons-material"

declare namespace System {
  /**
   * Chat Assistants
   */

  // 一个消息
  interface Message {
    type: 'Assistant' | 'User' | 'System'
    id: string
    value: string
  }
  // 关联的一个云端文件
  interface CloudFile {
    type: 'img' | 'md' | 'excel' | 'word' | 'pdf' | 'mp3' | 'py'
    id: string
    filename: string
  }
  // 关联一个Function
  interface CloudFile {
    type: 'Local' | 'API' | 'JSCode' | 'PythonCode' | 'Assistant'
    id: string
    filename: string
  }
  // 多个文件,多个消息集合,一个助手的所有关联数据 对应Open API code_interpreter,retrieval,function
  interface AssistantData {
    AssistantID: string
    CodeInterpreter: boolean
    Messages: Array<Message>
    CloudFiles: Array<CloudFile>
    FunctionS: Array<CloudFile>
  }
  // 助手的基本信息,包含模型类型,助手名称等
  interface AssistantBase {
    [prop: string]: string | number | boolean
  }
  // 一个(助手信息 + 管理数据)
  interface Assistant {
    AssistantBase: AssistantBase
    AssistantData?: AssistantData
  }
  // 全部助手集合,与resources中assistants文件yml数量相同
  type Assistants = Map<string, Assistant>

  /**
   * Image 助手信息(!注意目前DELL-E 3暂不支持Assistants,没有连续的提问方式,可尝试累加Message方式对话交互)
   * 暂时不开发!
   * (目前主要思路是利用Assistants 的Function 回调DELL-E,提示词中通知助手主要功能是绘画,用户要求时回调绘图API)
   */

  interface ImageBase {
    [prop: string]: string | number
  }
}
