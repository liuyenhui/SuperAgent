/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Stack } from '@mui/joy'
import HeadView from './head/headview'
import ListView from './list/listview'
import { LEFT_WIDTH } from '@renderer/components/public/constants'
import { useState } from 'react'
export default function Left(): JSX.Element {
  const [ml, _setMl] = useState('0px')
  // 触发隐藏左边栏

  // setTimeout(() => {
  //     setMl(`-${LEFT_WIDTH}px`);

  // }, 3000);
  return (
    <Box
      minWidth={LEFT_WIDTH}
      width={LEFT_WIDTH}
      sx={{
        marginLeft: ml,
        transition: 'marginLeft 0.5s',
        overflowY: 'hidden'
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
