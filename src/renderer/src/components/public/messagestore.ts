/**
 * 定义消息存储
 */
import { create } from 'zustand'
import log from 'electron-log/renderer'

// 存储实体
const messages: System.MessageStoreType = {
  threads: []
}
export const MessageStore = create<System.MessageStoreType>()(() => messages)

// 增加一个消息 通过线程ID,Message
export const InsertMessage = (thread_id: string, message: System.Message): void =>
  MessageStore.setState((store) => {
    log.info(`insert message:${JSON.stringify(message)}`)
    log.info(`old store:${JSON.stringify(store)}`)
    const newstore = {
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
    }
    log.info(`new store:${JSON.stringify(newstore)}`)
    return newstore
  })
// 替换一个消息
export const ReplaceMessage = (thread_id: string, newMessage: System.Message): void =>
  MessageStore.setState((store) => ({
    ...store,
    threads: store.threads.map((thread) => {
      return thread.thread_id === thread_id
        ? ({
            ...thread,
            // metadata Loaclid 与 msg.id 相同则替换消息,(open ai 返回消息后替换)
            messages: [
              ...thread.messages.map((msg) => {
                const LocalID = (newMessage.metadata as object)['LocalID'] as string
                log.info(`new message id vs msg id ${LocalID}:${msg.id}`)
                return (newMessage.metadata as object)['LocalID'] == msg.id ? newMessage : msg
              })
            ].sort((a, b) => b.created_at - a.created_at)
          } as never)
        : thread
    })
  }))
// 增加一个线程
export const InsertThread = (thread_id: string, message: System.Message[]): void =>
  MessageStore.setState((store) => ({
    ...store,
    threads: [
      // 删除线程id,再次添加,空消息
      ...store.threads.filter((thread) => thread.thread_id != thread_id),
      { thread_id: thread_id, messages: message }
    ]
  }))
// 删除线程
export const DeleteThread = (thread_id: string): void =>
  MessageStore.setState((state) => ({
    ...state,
    threads: [
      ...state.threads.filter((thread) => {
        return thread.thread_id != thread_id
      })
    ]
  }))
// 获取线程全部消息(不包含重复的run_id,thread_id)
export const UseMessages = (thread_id: string): System.Message[] | undefined => {
  return MessageStore((store) => {
    // 全部消息
    const allmessges = store.threads.find((thread) => thread.thread_id === thread_id)?.messages
    // 保留每个run最后一条消息
    const messages = allmessges?.filter((item, index, array) => {
      if (index > 0) {
        return item.run_id != array[index - 1].run_id
      } else {
        // 第一个消息返回
        return true
      }
    })
    return messages
  })
}
// 获取线程中的某个消息
export const GetMessages = (thread_id: string, message_id: string): System.Message | undefined => {
  const allmessges = MessageStore.getState().threads.find((thread) => thread.thread_id == thread_id)
    ?.messages
  const message = allmessges?.find((msg) => {
    return msg.id == message_id
  })
  return message
}

// 删除消息
export const DeleteMessages = (thread_id: string): void => {
  MessageStore.setState((store) => {
    // 发送消息删除
    return {
      ...store,
      threads: [
        ...store.threads.map((thread) => {
          return thread.thread_id == thread_id ? { ...thread, messages: [] } : thread
        })
      ]
    }
  })
}
export const SetMessageSteps = (
  thread_id: string,
  run_id: string,
  steps: Array<System.Step>
): void => {
  MessageStore.setState((store) => {
    const thread = store.threads.find((th) => th.thread_id == thread_id)
    if (!thread) return { ...store }
    const msg = thread.messages.find((msg) => msg.run_id == run_id)
    if (!msg || !msg.metadata) return { ...store }
    msg.metadata.Steps = steps
    return {
      ...store
    }
  })
}
// 获取steps 需要renderer 进程中使用
export const GetMessagesSteps = (thread_id: string, message_id: string): Array<System.Step> => {
  const steps = MessageStore((store) => {
    return store.threads
      .find((th) => th.thread_id == thread_id)
      ?.messages.find((msg) => msg.id == message_id)?.metadata?.Steps
  })
  return steps ? steps : []
}

// [
//   // 以下是测试数据
//   {
//     thread_id: 'asst_bMu5lCEpvQIkmFfAyCxTyzZ4',
//     messages: [
//       {
//         id: 'msg_22768',
//         object: 'thread.message',
//         created_at: 1698983503,
//         thread_id: 'thread_abc123',
//         role: 'assistants',
//         content: [
//           {
//             type: 'text',
//             text: {
//               value: 'sorry',
//               annotations: []
//             }
//           }
//         ],
//         assistant_id: 'asst_abc123',
//         run_id: 'run_abc123',
//         file_ids: [],
//         metadata: {}
//       },
//       {
//         id: 'msg_22789',
//         object: 'thread.message',
//         created_at: 1698983503,
//         thread_id: 'thread_abc123',
//         role: 'user',
//         content: [
//           {
//             type: 'text',
//             text: {
//               value:
//                 'Hi!提示：MAC 系统下如果遇到提示：open ip.txt: no such file or directory 说明你没有在软件所在目录下运行。# 如果平均延迟非常低（如 0.xx），则说明 CloudflareST 测速时走了代理，请先关闭代理软件后再测速。# 如果在路由器上运行，请先关闭路由器内的代理（或将其排除），否则测速结果可能会不准确/无法使用。',
//               annotations: []
//             }
//           }
//         ],
//         file_ids: [],
//         assistant_id: 'asst_abc123',
//         run_id: 'run_abc123',
//         metadata: {}
//       },
//       {
//         id: 'msg_22975',
//         object: 'thread.message',
//         created_at: 1698983503,
//         thread_id: 'thread_abc123',
//         role: 'assistants',
//         content: [
//           {
//             type: 'text',
//             text: {
//               value: `No rush though — we still have to wait for Lana's designs.`,
//               annotations: []
//             }
//           }
//         ],
//         file_ids: [],
//         assistant_id: 'asst_abc123',
//         run_id: 'run_abc123',
//         metadata: {}
//       },
//       {
//         id: 'msg_22987',
//         object: 'thread.message',
//         created_at: 1698983503,
//         thread_id: 'thread_abc123',
//         role: 'user',
//         content: [
//           {
//             type: 'text',
//             text: {
//               value: 'hi',
//               annotations: []
//             }
//           }
//         ],
//         file_ids: [],
//         assistant_id: 'asst_abc123',
//         run_id: 'run_abc123',
//         metadata: {}
//       }
//     ]
//   }
// ]
