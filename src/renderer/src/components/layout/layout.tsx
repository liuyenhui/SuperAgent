import Box from '@mui/joy/Box'
import { LinearProgress, Stack } from '@mui/joy'
import FooterBar from './footerbar/footerbar'
import Content from './content/content'
import { SystemInfoStore } from '../public/systemstore'
import { SetOpenAiAPIKeyDialog } from './setopenaiapikey'

export default function Layout(): JSX.Element {
  const loading = SystemInfoStore((state) => state.info.Loading)
  return (
    <Box sx={{ width: 1 }} display="grid">
      <Stack direction="column" alignItems="stretch" justifyContent="flex-start">
        <Content />
        <FooterBar />
      </Stack>
      <LinearProgress
        thickness={2}
        sx={{
          position: 'fixed',
          width: '100%',
          bottom: '0',
          left: '0',
          zIndex: '10',
          m: '0',
          // 全局修改
          display: loading ? 'flex' : 'none'
        }}
      />
      <SetOpenAiAPIKeyDialog />
    </Box>
  )
}
