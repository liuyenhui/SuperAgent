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
    role: 'user' | 'assistant'
    content: Array<ImageFile | Text>
    assistant_id: string | null
    run_id: string | null
    // 附加的文件IDs 最多10个
    file_ids: Array<string>
    // 保存使用线程ID  'thread_id':'thread_abc123' 通过线程ID list messages
    // 属性:MessageState: 'None' 'UploadFile' 'UserSend' 'UserSendResult' 'WaitRun' 'RunResult', LocalID: msglocalid
    // 属性:Steps: Array<Step>
    metadata:
      | {
          MessageState:
            | 'None'
            | 'UploadFile'
            | 'UserSend'
            | 'UserSendResult'
            | 'WaitRun'
            | 'RunResult'
          LocalID: string | undefined
          Steps: Array<System.Step> | undefined
        }
      | undefined
  }
  // 消息附加的文件ID
  interface MessageFile {
    id: string
    object: 'thread.message.file'
    created_at: number
    // 消息附加的文件ID
    message_id: string
  }

  // 步骤类型 消息创建(message_creation)或工具调用(tool_calls), 多个工具用数组
  type message_creation = {
    type: 'message_creation'
    message_creation: {
      message_id: string
    }
  }
  // tool_calls  代码解释器(Code_interpreter) or 文件检索(Retrieval) or 函数调用(FunctionCall)
  type Code_interpreter = {
    id: string
    type: 'code_interpreter'
    code_interpreter: {
      input: string
      // 代码解释器输出两种情况, logs 文本输出,image 图像文件输出
      outputs: Array<
        | {
            type: 'logs'
            logs: string
          }
        | {
            type: 'image'
            image: {
              file_id: string
            }
          }
      >
    }
  }
  type Retrieval = {
    id: string
    type: 'retrieval'
    // For now, this is always going to be an empty object.
    retrieval: null
  }
  type FunctionCall = {
    id: string
    type: 'retrieval'
    function: {
      name: string
      arguments: string
      output: string | null
    }
  }
  type tool_calls = {
    type: 'tool_calls'
    tool_calls: Array<Code_interpreter | Retrieval | FunctionCall>
  }
  //
  interface Step {
    id: string
    object: string
    created_at: number
    run_id: string
    assistant_id: string
    thread_id: string
    type: 'message_creation' | 'tool_calls'
    status: 'in_progress' | 'cancelled' | 'failed' | 'completed' | 'expired'
    cancelled_at: number
    completed_at: number
    expires_at: number
    failed_at: number
    last_error: {
      code: string
      message: string
    }
    step_details: message_creation | tool_calls
    usage: {
      prompt_tokens: number
      completion_tokens: number
      total_tokens: number
    }
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

  type SendMessageState =
    | 'None'
    | 'UploadFile'
    | 'UserSend'
    | 'UserSendResult'
    | 'WaitRun'
    | 'RunResult'

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
    // metadata 附加信息 { thread_id: id }
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
  // 线程 包含线程消息
  interface ThreadType {
    thread_id: string
    messages: System.Message[]
  }
  // 消息存储(主进程使用,在此定义)
  interface MessageStoreType {
    threads: ThreadType[]
  }

  interface ImageBase {
    [prop: string]: string | number
  }
  interface FileType {
    FilePath: string
    FileName: string
    FilextName: string
  }
}
// Thread 结构

// declare namespace System {
//   interface Thread {
//     role: string
//   }
// }
