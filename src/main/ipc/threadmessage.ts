/**
 * 线程消息IPC通信
 */
import { ipcMain } from 'electron'
import { OpenAI } from 'openai'
import log from 'electron-log'
import { OpenAIParam, MainIPC } from './assistantipc'
import { v4 as uuidv4 } from 'uuid'
import { MessageListParams, ThreadMessage } from 'openai/resources/beta/threads/messages/messages'
import { sleep } from 'openai/core'
import { Run } from 'openai/resources/beta/threads/runs/runs'

ipcMain.handle('invoke_thread_message_create', async (_event, arge) => {
  const { thread_id, assistant_id, msg, file_ids } = arge
  log.info(
    `recv invoke_thread_message_create thread_id:${thread_id} assistant_id:${assistant_id} msg:${JSON.stringify(
      msg
    )} file_ids:${file_ids}`
  )
  const openai = new OpenAI(OpenAIParam)
  // 查询线程此处省略

  try {
    const thread = await openai.beta.threads.retrieve(thread_id)
    console.log(assistant_id, thread_id, thread)
    const message: System.Message = msg
    const value = message.content[0].type == 'text' ? message.content[0].text.value : ''
    // 设置发送完成,提前设置为UserSendResult,服务端数据会写入,后置还需要再次跟新服务器消息状态,影响性能
    ;(message.metadata as object)['MessageState'] = 'UserSendResult'
    // 创建用户消息
    const result = await openai.beta.threads.messages.create(thread_id, {
      content: value,
      role: 'user',
      file_ids: file_ids,
      metadata: message.metadata
    })
    result.assistant_id = assistant_id

    // 发送完成创建消息
    MainIPC.mainWindow.webContents.send('message_created_user_result', result)

    // test
    // return
    // 创建run
    const run = await openai.beta.threads.runs.create(thread_id, { assistant_id: assistant_id })

    const local_id = uuidv4()
    const assistantmessage: ThreadMessage = {
      id: local_id,
      assistant_id: assistant_id,
      role: 'assistant',
      content: [{ type: 'text', text: { value: '....', annotations: [] } }],
      created_at: Date.now(),
      file_ids: [],
      object: 'thread.message',
      run_id: run.id,
      thread_id: thread_id,
      metadata: { MessageState: 'WaitRun', LocalID: local_id }
    }
    // 通知渲染进程正在等待Run完成
    MainIPC.mainWindow.webContents.send('message_created_assistant', assistantmessage)
    const resultmsg = await WaitAssistantMessage(run.id, thread_id, local_id)
    if (resultmsg != null) {
      MainIPC.mainWindow.webContents.send('message_result_assistant', resultmsg)
    }
    return Promise.resolve(true)
  } catch (error) {
    return Promise.reject(error)
  }
})
async function WaitAssistantMessage(
  run_id: string,
  thread_id: string,
  local_id: string
): Promise<OpenAI.Beta.Threads.Messages.ThreadMessage | null> {
  const openai = new OpenAI(OpenAIParam)
  // 完成,取消,超时,失败
  const runstatus = ['completed', 'cancelled', 'expired', 'failed']
  let run: Run
  do {
    await sleep(500)
    run = await openai.beta.threads.runs.retrieve(thread_id, run_id)
  } while (!runstatus.includes(run.status))
  // 状态为完成,取出线程消息
  if (run.status == 'completed') {
    try {
      // 倒序取出最近100条消息
      const listparam: MessageListParams = { order: 'desc', limit: 100 }

      const messages = await openai.beta.threads.messages.list(thread_id, listparam)
      const msg = messages.data[0]
      // 助手消息已提前返回到渲染进程,内容为"..."
      // Run完成后 附加metadata RunResult状态会停止动画,local_id用于替换消息依据
      msg.metadata = { MessageState: 'RunResult', LocalID: local_id }
      return msg.role == 'assistant' ? msg : null
    } catch (error) {
      return null
    }
  }
  return null
}
