import { Stack } from '@mui/joy'
import { RIGHT_LIST_HEIGHT, RIGHT_LIST_BOTTOM } from '@renderer/components/public/constants'

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
      {}

      {/* {value=>value.Sysinfo.SystemData?.Email} */}
    </Stack>
  )
}
