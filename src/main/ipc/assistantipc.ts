/**
 * 主进程IPC通信
 *
 *  1. 处理文件存取
 *  2. 处理OpenAI API
 *
 */
import { ipcMain, shell } from 'electron'
import { AssistantsLoad, AssistantsSave } from '../assistantsload'

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

// 主动消息
// MainIPC.mainWindow.webContents.send('respone_assistants', callback)
export const MainIPC: MainIPCType = {} as MainIPCType
