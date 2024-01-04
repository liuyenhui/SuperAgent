// import { Assessment } from "@mui/icons-material"

declare namespace System {
  /**
   * Chat Assistants
   */

  // 消息内容是image文件
  interface ImageFile {
    type: 'image_file'
    image_file: {
      file_id: string
    }
  }
  // file_citation retrieval 检索文件的引用,
  interface FileCitation {
    type: 'file_citation'
    // 需要替换的文本。
    text: string
    file_citation: {
      // 引用的内容
      quote: string
      // 引用文件的ID
      file_id: string
    }
    start_index: number
    end_index: number
  }
  // code_interpreter 生产文件的url
  interface FilePath {
    type: 'file_path'
    // 需要替换的文本。
    text: string
    file_path: {
      // 生成的文件ID
      file_id: string
    }
    start_index: number
    end_index: number
  }

  // 消息内容是文本
  interface Text {
    type: 'text'
    text: {
      value: string
      annotations: Array<FilePath | FileCitation>
    }
  }
  // 一个消息
  interface Message {
    id: string
    object: string
    created_at: number
    thread_id: string
    role: 'user' | 'assistants'
    content: Array<ImageFile | Text>
    assistant_id: string
    run_id: string
    // 附加的文件IDs 最多10个
    file_ids: Array<string>
    // 保存使用线程ID  'thread_id':'thread_abc123' 通过线程ID list messages
    metadata: object
  }
  // 消息附加的文件ID
  interface MessageFile {
    id: string
    object: 'thread.message.file'
    created_at: number
    // 消息附加的文件ID
    message_id: string
  }

  // // 关联的一个云端文件
  // interface CloudFile {
  //   type: 'img' | 'md' | 'excel' | 'word' | 'pdf' | 'mp3' | 'py'
  //   id: string
  //   filename: string
  // }
  // // 关联一个Function
  // interface CloudFile {
  //   type: 'Local' | 'API' | 'JSCode' | 'PythonCode' | 'Assistant'
  //   id: string
  //   filename: string
  // }
  // 多个文件,多个消息集合,一个助手的所有关联数据 对应Open API code_interpreter,retrieval,function
  interface AssistantData {
    Messages: Array<Message>
  }

  type SendMessageState = 'None' | 'UploadFile' | 'Send'

  // 助手的基本信息,包含模型类型,助手名称等
  interface AssistantBase {
    // [prop: string]: string | number | boolean
    // 名字 ChatGPT
    Name: string
    //模型ID
    Model: string
    //描述
    Description: string
    // 图片路径
    ImagePath: string
    // 图片文件名
    FileName: string
    // 助手ID
    AssistantID: string
    // 创建时间戳
    CreateAt: number
    // 提示词
    Prompt: string
    // 代码解释器
    CodeInterpreter: boolean
    // 可用状态,remote 未验证时为true,当invoke_init_assistants创建后返回false表示当前可用
    Disabled: boolean
    // metadata 附加信息
    MetaData: object
    // 消息状态 None 可发送, UploadFile 正在上传文件, Send,正在发送消息
    MessageState: SendMessageState
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
// Thread 结构

// declare namespace System {
//   interface Thread {
//     role: string
//   }
// }
