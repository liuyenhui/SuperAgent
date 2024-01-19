import { Sheet, Stack } from '@mui/joy'
import { RIGHT_LIST_HEIGHT, RIGHT_LIST_BOTTOM } from '@renderer/components/public/constants'
import { MessagePan } from './messagepan/messagepan'
import { SystemInfoStore } from '@renderer/components/public/systemstore'
import { UseMessages } from '@renderer/components/public/messagestore'
import { useEffect, useRef } from 'react'
import { AssistantsStore } from '@renderer/components/public/assistantstore'

export default function ChatList(): JSX.Element {
  // 此处没有变化 !!! 刷新后不滚动到底部
  console.log('debug')
  const listview = useRef<HTMLInputElement>(null)

  const assistantid = SystemInfoStore((store) => store.AssistantID)
  const thread_id = AssistantsStore(
    (state) => state.Assistants.get(assistantid)?.AssistantBase.MetaData['thread_id']
  )
  const messages = UseMessages(thread_id)
  console.log(messages)
  // const threads = MessageStore(state=>state.threads)
  // const thread = threads.filter(thread=>thread.thread_id==)
  useEffect(() => {
    // 刷新后滚动到底部
    if (listview.current && listview.current.scrollTo)
      listview.current.scrollTo({ top: listview.current.scrollHeight - listview.current.height })
  })
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
      sx={{}}
      // ?? bug 2023.12.13 缩小窗口 消息应跟随滚动到最下方
    >
      <Sheet
        ref={listview}
        sx={{
          display: 'flex',
          flexDirection: 'column-reverse',
          width: '100%',
          overflowY: 'scroll', //'auto',
          pb: '0px',
          height: '100%',
          // scrollbarWidth: '3px',
          '&::-webkit-scrollbar': {
            width: '3px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(14, 13, 13, 0.8)',
            borderRadius: '10px'
            // boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            // webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgb(48, 45, 45)',
            borderRadius: '10px'
          }
        }}
      >
        {messages?.map((item) => <MessagePan key={item.id} msg={item}></MessagePan>)}
      </Sheet>
    </Stack>
  )
}
