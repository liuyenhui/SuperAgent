/**
 * 线程消息IPC通信
 */
import { ipcMain } from 'electron'
import { OpenAI } from 'openai'
import log from 'electron-log'
import { OpenAIParam, MainIPC } from './assistantipc'
import { v4 as uuidv4 } from 'uuid'
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages'

ipcMain.handle('invoke_thread_message_create', async (_event, arge) => {
  const { thread_id, assistant_id, msg, file_ids } = arge
  const openai = new OpenAI(OpenAIParam)
  // 查询线程此处省略
  const thread = await openai.beta.threads.retrieve(thread_id)
  console.log(assistant_id, thread_id, thread)
  const message: System.Message = msg
  const value = message.content[0].type == 'text' ? message.content[0].text.value : ''
  // 设置发送完成
  ;(message.metadata as object)['MessageState'] = 'UserSendResult'
  // const thread = await openai.beta.threads.retrieve(thread_id)
  try {
    const result = await openai.beta.threads.messages.create(thread_id, {
      content: value,
      role: 'user',
      file_ids: file_ids,
      metadata: message.metadata
    })

    // 发送完成创建消息
    MainIPC.mainWindow.webContents.send('message_created_user', result)
    log.info(
      `create message return ${result} thread_id:${thread_id} msg:${msg} file_ids:${file_ids}`
    )
    // 创建run
    // const run = openai.beta.threads.runs.create(thread_id, { assistant_id: assistant_id })
    const id = uuidv4()
    const assistantmessage: ThreadMessage = {
      id: id,
      assistant_id: assistant_id,
      role: 'assistant',
      content: [{ type: 'text', text: { value: '...', annotations: [] } }],
      created_at: Date.now(),
      file_ids: [],
      object: 'thread.message',
      run_id: null,
      thread_id: thread_id,
      metadata: { MessageState: 'WaitRun', LocalID: id }
    }
    MainIPC.mainWindow.webContents.send('message_created_assistant', assistantmessage)
    // const respons = await run.withResponse()
    // console.log(respons)
  } catch (error) {
    return Promise.reject(error)
  }

  return Promise.resolve(true)
})
