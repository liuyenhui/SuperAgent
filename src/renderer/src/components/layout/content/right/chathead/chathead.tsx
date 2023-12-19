import { Sheet } from '@mui/joy'
import Stack from '@mui/joy/Stack'
import { RIGHT_HEAD_HEIGHT } from '@renderer/components/public/constants'
export default function ChatHead(): JSX.Element {
  return (
    <Sheet variant="soft" sx={{ width: '100%', height: RIGHT_HEAD_HEIGHT }}>
      <Stack
        direction="row"
        alignItems="stretch"
        justifyContent="flex-start"
        sx={{
          // position:"fixed",
          width: 1,
          height: '60px'
          // backgroundColor:"darkgreen"
        }}
      >
        ChatHead
      </Stack>
    </Sheet>
  )
}
