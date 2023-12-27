import { Stack } from '@mui/joy'
import { RIGHT_LIST_HEIGHT, RIGHT_LIST_BOTTOM } from '@renderer/components/public/constants'
import { MessagePan } from './messagepan/messagepan'

export interface MessageType {
  id: string
  object: string
  created_at: number
  thread_id: string
  role: string
  content: Array<{
    type: string
    text: {
      value: string
      annotations: Array<object>
    }
  }>
  file_ids: Array<string>
  assistant_id: string
  run_id: string
  metadata: object
}
const msgs: Array<MessageType> = [
  {
    id: 'msg_abc123',
    object: 'thread.message',
    created_at: 1698983503,
    thread_id: 'thread_abc123',
    role: 'user',
    content: [
      {
        type: 'text',
        text: {
          value: 'Hi!提示：MAC 系统下如果遇到提示：open ip.txt: no such file or directory 说明你没有在软件所在目录下运行。# 如果平均延迟非常低（如 0.xx），则说明 CloudflareST 测速时走了代理，请先关闭代理软件后再测速。# 如果在路由器上运行，请先关闭路由器内的代理（或将其排除），否则测速结果可能会不准确/无法使用。',
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
    id: 'msg_abc123',
    object: 'thread.message',
    created_at: 1698983503,
    thread_id: 'thread_abc123',
    role: 'assistant',
    content: [
      {
        type: 'text',
        text: {
          value:'提示：MAC 系统下如果遇到提示：open ip.txt: no such file or directory 说明你没有在软件所在目录下运行。# 如果平均延迟非常低（如 0.xx），则说明 CloudflareST 测速时走了代理，请先关闭代理软件后再测速。# 如果在路由器上运行，请先关闭路由器内的代理（或将其排除），否则测速结果可能会不准确/无法使用。',
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

export default function ChatList(): JSX.Element {
  // 此处没有变化
  console.log('debug')

  return (
    <Stack
      direction="column"
      // alignItems="stretch"
      alignItems="flex-start"
      justifyContent="flex-end"
      height={RIGHT_LIST_HEIGHT}
      // 固定块暂未使用 position="absolute"
      bottom={RIGHT_LIST_BOTTOM}
      width="calc(100% - 3px)"
      // ?? bug 2023.12.13 缩小窗口 消息应跟随滚动到最下方

      sx={{
        overflow: 'scroll',
        pb: '0px'
      }}
    >
      {msgs.map((item) => (
        <MessagePan key={item.id} msg={item}></MessagePan>
      ))}

      {/* {value=>value.Sysinfo.SystemData?.Email} */}
    </Stack>
  )
}
