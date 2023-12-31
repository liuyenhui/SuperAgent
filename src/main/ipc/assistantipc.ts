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
type MainIPCType = {
  app: Electron.App
  mainWindow: Electron.BrowserWindow
  resourcesPath: string
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
  const apikey = arge[0]
  const baseurl = arge[1]
  log.info(`apikey:${arge[0]} baseurl:${arge[1]}`)
  const openai = new OpenAI({
    apiKey: apikey,
    baseURL: baseurl
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
  try {
    const newassistans = await SyncAssistants(key, url, assistants)
    return Promise.resolve(newassistans)
  } catch (error) {
    log.info(error)
    return Promise.reject(error)
  }
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
  const openai = new OpenAI({
    apiKey: key,
    baseURL: url
  })
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
  return newassistants
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
    metadata: null,
    name: loacl.AssistantBase.Name,
    tools: tools
  }
  return remote
}
// 远程助手附加信息到本地助手 返回本地助手
function AttachLoaclAssistant(local: System.Assistant, remote: Assistant): System.Assistant {
  local.AssistantBase.AssistantID = remote.id
  local.AssistantBase.CreateAt = remote.created_at
  //关闭Disabled
  local.AssistantBase.Disabled = false
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
