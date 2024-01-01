/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Stack } from '@mui/joy'
import HeadView from './head/headview'
import ListView from './list/listview'
import { LEFT_WIDTH } from '@renderer/components/public/constants'
import { SystemInfoStore } from '@renderer/components/public/systemstore'
export default function Left(): JSX.Element {
  const lefthidden = SystemInfoStore((state) => state.info.LeftHidden)

  // 触发隐藏左边栏

  // setTimeout(() => {
  //     setMl(`-${LEFT_WIDTH}px`);

  // }, 3000);
  return (
    <Box
      minWidth={LEFT_WIDTH}
      width={LEFT_WIDTH}
      sx={{
        marginLeft: lefthidden ? `-${LEFT_WIDTH}px` : `0`
        // transition: '0 1s',
        // overflowY: 'marginLeft'
      }}
    >
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="stretch"
        sx={{ width: 1 }}
        // spacing={2}
      >
        <HeadView />
        <ListView />
      </Stack>
    </Box>
  )
}
