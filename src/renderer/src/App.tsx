import { Box, CssVarsProvider } from '@mui/joy'
// 进程通信,proload 见:electron/preload/index.ts
// console.log(window.api())
import Layout from './components/layout/layout'
function App(): JSX.Element {
  return (
    <CssVarsProvider defaultMode="dark">
      <Box
        sx={{
          bgcolor: 'background.paper',
          m: 0,
          p: 0,
          width: 1,
          height: 1
        }}
      >
        <Layout />
      </Box>
    </CssVarsProvider>
  )
}
export default App
