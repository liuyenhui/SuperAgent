/**
 * 主进程IPC通信
 *
 *  1. 处理文件存取
 *  2. 处理OpenAI API
 *
 */
import { ipcMain } from 'electron'
import { AssistantsLoad, AssistantsSave } from '../assistantsload'

type MainIPCType = {
  app: Electron.App
  mainWindow: Electron.BrowserWindow
  resourcesPath: string
}
// !!!同步消息返回 assistantlist,未使用,同步消息会阻塞
ipcMain.on('get_assistants', (event) => {
  console.log(`event:${event}`)
  const assistantlist = AssistantsLoad(MainIPC.resourcesPath)
  event.returnValue = assistantlist
})
// 同步请求
ipcMain.on('assistants_load', (event) => {
  const assistantlist = AssistantsLoad(MainIPC.resourcesPath)
  event.returnValue = assistantlist
})

ipcMain.on('assistants_save', (event, assistants) => {
  AssistantsSave(MainIPC.resourcesPath, assistants)
  event.returnValue = true
})

// 渲染进程调用invoke
ipcMain.handle('invoke_assistants', () => {
  const assistantlist = AssistantsLoad(MainIPC.resourcesPath)
  return assistantlist
})

// 主动消息
// MainIPC.mainWindow.webContents.send('respone_assistants', callback)
export const MainIPC: MainIPCType = {} as MainIPCType
