import Box from '@mui/joy/Box'
import { LinearProgress, Snackbar, Stack } from '@mui/joy'
import FooterBar from './footerbar/footerbar'
import Content from './content/content'
import { SetingStore, SetAppState, KeyState } from '@renderer/components/public/setingstore'
import { SetOpenAiAPIKeyDialog } from './setopenaiapikey'
import { SubscribeStore } from '../public/SubscribeStore'
import { useEffect, useState } from 'react'
import { SystemInfoStore, CloseMessage } from '@renderer/components/public/systemstore'

export default function Layout(): JSX.Element {
  const [loading, setLoading] = useState(false)

  // 初始化数据
  useEffect(() => {
    const key = SetingStore.getState().OpenAiAPIKey
    const baseurl = SetingStore.getState().BaseURL
    if (key === '' || baseurl === '') return
    SetAppState(KeyState.None)
    setLoading(true)
    window.electron.ipcRenderer
      .invoke('test_openai_key', { key: key, url: baseurl })
      .then(() => {
        SetAppState(KeyState.Setkey)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

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
      {/* 订阅Sotre组件,空标签,不显示 */}
      <SubscribeStore />
      <SetOpenAiAPIKeyDialog />
      <PopMessage />
    </Box>
  )
}
function PopMessage(): JSX.Element {
  const pm = SystemInfoStore((store) => store.info.PopMessage)
  // console.log(pm)
  // const [content, setContent] = useState('')
  // window.api.popmessage = (msg: string): void => {
  //   setContent(msg)
  //   setOpen(true)
  // }
  // useEffect(() => {

  // }, [])

  return (
    <Snackbar
      autoHideDuration={3000}
      onClose={() => CloseMessage()}
      open={pm.Open}
      color={pm.Color as never}
      variant={pm.Variant as never}
      anchorOrigin={{ vertical: pm.Vertical as never, horizontal: pm.Horizontal as never }}
    >
      {pm.Msg}
    </Snackbar>
  )
}
