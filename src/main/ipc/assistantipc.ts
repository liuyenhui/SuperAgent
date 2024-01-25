/**
 * 主进程IPC通信
 *
 *  1. 处理文件存取
 *  2. 处理OpenAI API
 *
 */
import { ipcMain, shell } from 'electron'
import { AssistantsLoad, AssistantsSave } from '../assistantsload'
import log from 'electron-log'
import { OpenAI } from 'openai'
import { AssistantCreateParams, Assistant } from 'openai/resources/beta/assistants/assistants'
import { MessageListParams } from 'openai/resources/beta/threads/messages/messages'
type MainIPCType = {
  app: Electron.App
  mainWindow: Electron.BrowserWindow
  resourcesPath: string
}
export const OpenAIParam = {
  apiKey: '',
  baseURL: '',
  timeout: 5000
}
// 同步请求
ipcMain.on('assistants_load', (event) => {
  const assistantlist = AssistantsLoad(MainIPC.resourcesPath)
  event.returnValue = assistantlist
})

ipcMain.on('assistants_save', (event, assistants) => {
  AssistantsSave(MainIPC.resourcesPath, assistants)
  event.returnValue = true
})

// 渲染进程调用invoke 异步
ipcMain.handle('invoke_assistants', () => {
  const assistantlist = AssistantsLoad(MainIPC.resourcesPath)
  return assistantlist
})
// 浏览器打开网址
ipcMain.handle('invoke_openurl', (_event, arge) => {
  shell.openExternal(arge)
  return null
})

// 测试API KEY
ipcMain.handle('test_openai_key', async (_event, arge) => {
  const { key, url } = arge
  log.info(`apikey:${key} baseurl:${url}`)
  const openai = new OpenAI({
    apiKey: key,
    baseURL: url,
    timeout: 5000
  })
  try {
    const models = await openai.models.list()
    return Promise.resolve(models)
  } catch (e) {
    // 无法传递error https://github.com/electron/electron/issues/24427
    return Promise.reject(e)
  }
})

// 设置openai key 完成 初始化Assistant,arge[0] as object(key,baseurl) arge[1] assistants
ipcMain.handle('invoke_init_assistants', async (_event, arge) => {
  const { key, url, assistants } = arge
  // 设置OpenAIParam
  OpenAIParam.apiKey = key
  OpenAIParam.baseURL = url

  try {
    const newassistans = await SyncAssistants(key, url, assistants)
    return Promise.resolve(newassistans)
  } catch (error) {
    log.info(error)
    return Promise.reject(error)
  }
})
ipcMain.handle('invoke_update_assistant_codeinterpreter', async (_event, arge) => {
  const [assistant_id, code_interpreter] = [...arge]
  const openai = new OpenAI(OpenAIParam)
  const assistant = await openai.beta.assistants.retrieve(assistant_id)
  let tools = assistant.tools
  // 先删除代码解释器
  tools = tools.filter((item) => {
    return item.type != 'code_interpreter'
  })
  // 传入true则添加
  if (code_interpreter) {
    tools.push({ type: 'code_interpreter' })
  }
  await openai.beta.assistants.update(assistant_id, { tools: tools })
})
ipcMain.handle('invoke_update_assistant_model', async (_event, arge) => {
  const { assistant_id, model } = arge
  const openai = new OpenAI(OpenAIParam)
  await openai.beta.assistants.update(assistant_id, { model: model })
})
// arge - { thread_id , before_message_id}
ipcMain.handle('invoke_thread_message_list', async (_event, arge) => {
  const { thread_id, before_message_id = undefined } = arge
  try {
    const messages = await SyncThreadMessages(thread_id, before_message_id)
    return Promise.resolve(messages)
  } catch (error) {
    return Promise.reject(error)
  }
})
ipcMain.handle('invoke_thread_message_delete', async (_event, arge) => {
  const { assistant_id, thread_id } = arge
  log.info(`delete message ${assistant_id},${thread_id}`)
  try {
    // 创建thread
    const openai = new OpenAI(OpenAIParam)
    const newthread = await openai.beta.threads.create()
    // 删除旧线程
    await openai.beta.threads.del(thread_id)
    // 更新assistant
    await openai.beta.assistants.update(assistant_id, { metadata: { thread_id: newthread.id } })
    return Promise.resolve({ AssistantID: assistant_id, NewThreadID: newthread.id })
  } catch (error) {
    log.info(`ipcMain invoke_thread_message_delete ${error}`)
    return Promise.reject(error)
  }
})
ipcMain.handle('invoke_update_assistant_name_prompt', async (_event, arge) => {
  const { AssistantID, Name, Prompt } = arge
  const openai = new OpenAI(OpenAIParam)
  const assistant = await openai.beta.assistants.update(AssistantID, {
    name: Name,
    instructions: Prompt
  })
  if (assistant) return Promise.resolve()
  else return Promise.reject('update assistant error')
})
/**
 * 同步远程助手
 * @param key API Key
 * @param url Base URL
 * @param assistants 本地助手字典
 * @returns 新的本地助手字典
 */
async function SyncAssistants(
  key: string,
  url: string,
  assistants: System.Assistants
): Promise<System.Assistants> {
  OpenAIParam.apiKey = key
  OpenAIParam.baseURL = url
  const openai = new OpenAI(OpenAIParam)

  // 清除远程助手 测试是打开情况助手
  // await ClearAllAssistant(openai)
  // 获取远程助手
  const remoteassistants = await openai.beta.assistants.list()
  console.log(remoteassistants)
  const newassistants = new Map<string, System.Assistant>()
  for (const assistant of assistants.values()) {
    // findassistant 返回ID相同的助手
    const findassistant = remoteassistants.data.find((remoteassistant) => {
      return (
        assistant.AssistantBase.AssistantID === remoteassistant.id &&
        assistant.AssistantBase.Name === remoteassistant.name
      )
    })
    if (findassistant) {
      // 找到匹配,直接附加远程数据后填回原本地助手信息
      AttachLoaclAssistant(assistant, findassistant)
      newassistants.set(assistant.AssistantBase.AssistantID, assistant)
      continue
    }
    // 未找到匹配 远程创建新Assistants
    // 根据本地配置创建新的远程assistant,返回转换后的本地assistant
    const newassistant = await CreateAssistantFormLoacl(openai, assistant)
    if (newassistant) {
      newassistants.set(newassistant.AssistantBase.AssistantID, newassistant)
      continue
    }
    // newassistant == null 触发error并返回
    const errmsg = `Create Assistants error on assistant ${assistant.AssistantBase.Name}!`
    log.info(errmsg)
    throw new Error(errmsg)
    //error 会直接break 出函数
  }
  // 添加助手消息
  return newassistants
}
async function SyncThreadMessages(
  thread_id: string,
  before_message_id: string
): Promise<System.ThreadType> {
  const threadmessage: System.ThreadType = { thread_id: thread_id, messages: [] }

  const openai = new OpenAI(OpenAIParam)
  const thread = await openai.beta.threads.retrieve(thread_id)
  if (!thread) {
    return threadmessage
  }
  const listparam: MessageListParams = { order: 'desc', limit: 100 }
  log.info(`list message ${thread_id} before ${before_message_id}`)
  const messages = await openai.beta.threads.messages.list(thread_id, listparam)
  threadmessage.messages = messages.data as Array<System.Message>
  log.info(`thread [${thread_id}] messages:`)
  log.info(threadmessage.messages)
  // messagestore.threads.push({ thread_id: thread_id, messages: messages.data })
  return threadmessage
}
/**
 *
 * @param openai
 * @param loaclassistant
 * @returns
 */
async function CreateAssistantFormLoacl(
  openai: OpenAI,
  loaclassistant: System.Assistant
): Promise<System.Assistant | null> {
  try {
    const remote = LocalAssistantToRemoteAssistant(loaclassistant)
    // 创建线程
    const thread = await openai.beta.threads.create()
    const id: string = thread['id'] as string
    remote.metadata = { thread_id: id }

    // 创建助手
    const result = await openai.beta.assistants.create(remote)
    const assistant = AttachLoaclAssistant(loaclassistant, result)

    return assistant
  } catch (error) {
    return null
  }
}
// 本地Assistant结构转openai创建assistant结构
function LocalAssistantToRemoteAssistant(loacl: System.Assistant): AssistantCreateParams {
  const tools = []
  // 加入代码解释器
  loacl.AssistantBase.CodeInterpreter ? tools.push({ type: 'code_interpreter' } as never) : null
  const remote: AssistantCreateParams = {
    model: loacl.AssistantBase.Model,
    description: loacl.AssistantBase.Description,
    // Array<string> ids
    file_ids: [],
    instructions: loacl.AssistantBase.Prompt,
    metadata: loacl.AssistantBase.MetaData,
    name: loacl.AssistantBase.Name,
    tools: tools
  }
  return remote
}
// 远程助手附加信息到本地助手 返回本地助手
function AttachLoaclAssistant(local: System.Assistant, remote: Assistant): System.Assistant {
  local.AssistantBase.AssistantID = remote.id
  local.AssistantBase.CreateAt = remote.created_at
  local.AssistantBase.MetaData = remote.metadata as object
  // 提示词
  local.AssistantBase.Prompt = remote.instructions ? remote.instructions : ''
  const tools = remote.tools.find((item) => {
    return item.type == 'code_interpreter'
  })
  tools
    ? (local.AssistantBase.CodeInterpreter = true)
    : (local.AssistantBase.CodeInterpreter = false)
  local.AssistantBase.Model = remote.model
  // remote.tools.find(OpenAI.Beta.Assistants.Assistant.CodeInterpreter)
  //关闭Disabled
  local.AssistantBase.Disabled = false
  // 设置状态
  local.AssistantBase.MessageState = 'None'
  return local
}
/**
 * 清除远程全部助手信息
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// async function ClearAllAssistant(openai: OpenAI): Promise<void> {
//   const list = await openai.beta.assistants.list()
//   list.data.map(async (assert) => {
//     const result = await openai.beta.assistants.del(assert.id)
//     log.info(`delete ${result}`)
//   })
// }

export const MainIPC: MainIPCType = {} as MainIPCType
