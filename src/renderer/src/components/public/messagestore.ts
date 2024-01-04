/**
 * 定义消息存储
 */
import { create } from 'zustand'

// 线程 包含线程消息
interface ThreadType {
  thread_id: string
  messages: System.Message[]
}
// 消息存储
interface MessageStoreType {
  threads: ThreadType[]
}

// 存储实体
const messages: MessageStoreType = {
  threads: [
    // 以下是测试数据
    {
      thread_id: 'asst_bMu5lCEpvQIkmFfAyCxTyzZ4',
      messages: [
        {
          id: 'msg_22768',
          object: 'thread.message',
          created_at: 1698983503,
          thread_id: 'thread_abc123',
          role: 'assistants',
          content: [
            {
              type: 'text',
              text: {
                value: 'sorry',
                annotations: []
              }
            }
          ],
          assistant_id: 'asst_abc123',
          run_id: 'run_abc123',
          file_ids: [],
          metadata: {}
        },
        {
          id: 'msg_22789',
          object: 'thread.message',
          created_at: 1698983503,
          thread_id: 'thread_abc123',
          role: 'user',
          content: [
            {
              type: 'text',
              text: {
                value:
                  'Hi!提示：MAC 系统下如果遇到提示：open ip.txt: no such file or directory 说明你没有在软件所在目录下运行。# 如果平均延迟非常低（如 0.xx），则说明 CloudflareST 测速时走了代理，请先关闭代理软件后再测速。# 如果在路由器上运行，请先关闭路由器内的代理（或将其排除），否则测速结果可能会不准确/无法使用。',
                annotations: []
              }
            }
          ],
          file_ids: [],
          assistant_id: 'asst_abc123',
          run_id: 'run_abc123',
          metadata: {}
        },
        {
          id: 'msg_22975',
          object: 'thread.message',
          created_at: 1698983503,
          thread_id: 'thread_abc123',
          role: 'assistants',
          content: [
            {
              type: 'text',
              text: {
                value: `No rush though — we still have to wait for Lana's designs.`,
                annotations: []
              }
            }
          ],
          file_ids: [],
          assistant_id: 'asst_abc123',
          run_id: 'run_abc123',
          metadata: {}
        },
        {
          id: 'msg_22987',
          object: 'thread.message',
          created_at: 1698983503,
          thread_id: 'thread_abc123',
          role: 'user',
          content: [
            {
              type: 'text',
              text: {
                value: 'hi',
                annotations: []
              }
            }
          ],
          file_ids: [],
          assistant_id: 'asst_abc123',
          run_id: 'run_abc123',
          metadata: {}
        }
      ]
    }
  ]
}
export const MessageStore = create<MessageStoreType>()(() => messages)

// 增加一个消息 通过线程ID,Message
export const InsertMessage = (thread_id: string, message: System.Message): void =>
  MessageStore.setState((store) => ({
    ...store,
    threads: store.threads.map((thread) => {
      return thread.thread_id === thread_id
        ? ({
            ...thread,
            // 删除同ID在添加,然后排序
            messages: [...thread.messages.filter((msg) => msg.id != message.id), message].sort(
              (a, b) => b.created_at - a.created_at
            )
          } as never)
        : thread
    })
  }))
// 增加一个线程
export const InsertThread = (thread_id: string): void =>
  MessageStore.setState((store) => ({
    ...store,
    threads: [...store.threads, { thread_id: thread_id, messages: [] }]
  }))
// 获取线程消息
export const UseMessages = (thread_id: string): ThreadType => {
  return MessageStore(
    (store) => store.threads.filter((thread) => thread.thread_id === thread_id)[0]
  )
}