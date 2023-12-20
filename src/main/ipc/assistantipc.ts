/**
 * 主进程IPC通信
 *
 *  1. 处理文件存取
 *  2. 处理OpenAI API
 *
 */
import { ipcMain } from 'electron'
import { AssistantsLoad } from '../assistantsload'

type MainIPCType = {
  app: Electron.App
  mainWindow: Electron.BrowserWindow
  resourcesPath: string
}
export const MainIPC: MainIPCType = {} as MainIPCType
// 同步消息返回 assistantlist
ipcMain.on('get_assistants', (event) => {
  const assistantlist = AssistantsLoad(MainIPC.resourcesPath)
  // console.log(assistant)
  // console.log(assistant.Config.Prompt)
  // // 写入yml文件
  // assistant.Config.Prompt = "小红书作者"
  // // 序列化对象 info
  // let yamlStr = yaml.dump(assistant);
  // console.log(yamlStr)
  // fs.writeFileSync(filename,yamlStr,'utf-8')
  console.log(`event:${event}`)
  event.returnValue = assistantlist
})
// 主动消息
// MainIPC.mainWindow.webContents.send('respone_assistants', callback)
