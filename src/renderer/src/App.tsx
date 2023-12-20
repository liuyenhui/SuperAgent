// import './App.css'
// import { ipcRenderer } from 'electron/renderer'
import { Box, CssVarsProvider } from '@mui/joy'
// eslint-disable-next-line @typescript-eslint/no-unused-vars

// 进程通信,proload 见:electron/preload/index.ts
// console.log(window.api())
import Layout from './components/layout/layout'

// import { SystemInfoStore } from '@renderer/components/public/systemstore'
// import { AssistantsStore } from '@renderer/components/public/assistantstore'

function App(): JSX.Element {
  console.log('app load.....')
  // const update = SystemInfoStore((state) => state.update)
  // const insertbase = AssistantsStore((state) => state.InsertAssistantBase)
  // // 主进程推送版本

  // ipcRenderer.on('main-msg-version', (_event, message) => {
  //   console.log(`recv main-msg-version ${message.version}`)
  //   update('AppVersion', message.version)
  // })
  // 获得助手信息
  // ipcRenderer.once('assistant-list', (_event, assistantlist) => {
  // const list: Array<unknown> = assistantlist
  // console.log(`recv assistant-list length:${list.length}`)
  // list.forEach((assistant) => {
  //   insertbase(assistant as System.AssistantBase)
  // })
  // })

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
