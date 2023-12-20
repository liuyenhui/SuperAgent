import { Box, CssVarsProvider } from '@mui/joy'
import log from 'electron-log/renderer'
// 进程通信,proload 见:electron/preload/index.ts
// console.log(window.api())
import Layout from './components/layout/layout'
import { useEffect } from 'react'
import { AssistantsStore } from '@renderer/components/public/assistantstore'

function App(): JSX.Element {
  const InsertAssistantBase = AssistantsStore((state) => state.InsertAssistantBase)
  // 执行一次,首次加载
  useEffect(() => {
    // 发送消息获取Assistants信息
    const assistants = window.electron.ipcRenderer.sendSync('get_assistants')
    log.info(assistants)
    InsertAssistantBase(assistants)
  }, [])

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
