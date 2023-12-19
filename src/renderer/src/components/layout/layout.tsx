import Box from '@mui/joy/Box'
import { Stack } from '@mui/joy'
import FooterBar from './footerbar/footerbar'
import Content from './content/content'

export default function Layout(): JSX.Element {
  return (
    <Box sx={{ width: 1 }} display="grid">
      <Stack direction="column" alignItems="stretch" justifyContent="flex-start">
        <Content />
        <FooterBar />
      </Stack>
    </Box>
  )
}
