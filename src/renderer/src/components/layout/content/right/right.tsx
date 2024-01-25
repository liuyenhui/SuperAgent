import { Sheet } from '@mui/joy'
import ChatHead from './chathead/chathead'
import ChatList from './chatlist/chatlist'
import ChatInput from './chatinput/chatinput'

// 对话区域高度 RIGHT_CHAT_WIDTH 未使用
import { RIGHT_CHAT_HEIGHT } from '@renderer/components/public/constants'

export default function Right(): JSX.Element {
  return (
    <Sheet
      variant="outlined"
      sx={{ m: '2px', height: RIGHT_CHAT_HEIGHT, width: '100%', maxWidth: '100%' }}
    >
      {/* <Stack
                direction="column"
                alignItems="stretch"
                justifyContent="space-between"
                // display="flex"

                sx={{height:"100%",width:"100%",m:0,p:0}}
            > */}
      <ChatHead></ChatHead>
      <ChatList></ChatList>
      <ChatInput></ChatInput>
      {/* </Stack> */}
    </Sheet>
  )
}
