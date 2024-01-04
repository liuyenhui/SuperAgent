/**
 * 线程消息IPC通信
 */
import { ipcMain } from 'electron'
import { OpenAI } from 'openai'
import log from 'electron-log'
import { OpenAIParam, MainIPC } from './assistantipc'


ipcMain.handle('invoke_thread_message', async (_event, arge) => {
  const { thread_id, assistant_id, msg, file_ids } = arge
  const openai = new OpenAI(OpenAIParam)
  // 查询线程此处省略
  const assistant = await openai.beta.assistants.retrieve(assistant_id)
  console.log(assistant)
  // const thread = await openai.beta.threads.retrieve(thread_id)
  try {
    const result = await openai.beta.threads.messages.create(thread_id, {
      content: msg,
      role: 'user',
      file_ids: file_ids
    })
    // 发送完成创建消息
    MainIPC.mainWindow.webContents.send('message_created_user', result)
    log.info(
      `create message return ${result} thread_id:${thread_id} msg:${msg} file_ids:${file_ids}`
    )
  } catch (error) {
    return Promise.reject(error)
  }

  return Promise.resolve(true)
})
