import {
  Button,
  DialogContent,
  DialogTitle,
  FormLabel,
  Input,
  Link,
  Modal,
  Typography,
  ModalDialog,
  Stack,
  ModalClose,
  Sheet,
  LinearProgress,
  Snackbar
} from '@mui/joy'
import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'

import { useTranslation } from 'react-i18next'

import {
  SetingStore,
  SetOpenDialogState,
  SetBaseURL,
  SetOpenAiApiKey,
  SetAppState,
  KeyState,
  SetModels
} from '@renderer/components/public/setingstore'
import { useState } from 'react'

enum InputState {
  None,
  Success,
  Warning
}

function InputEnd(props: { state: InputState }): JSX.Element {
  const prop = {
    color: '',
    svg: ''
  }
  if (props.state == InputState.None || !props.state) {
    prop.color = 'disabled'
    prop.svg = SvgPathMap.RemoveCircle
  } else if (props.state == InputState.Success) {
    prop.color = 'success'
    prop.svg = SvgPathMap.Check
  } else if (props.state == InputState.Warning) {
    prop.color = 'warning'
    prop.svg = SvgPathMap.Close
  }

  return (
    <SvgIcons sx={{ width: '15px', height: '15px' }} color={prop.color as never} d={prop.svg} />
  )
}

export function SetOpenAiAPIKeyDialog(): JSX.Element {
  // 对话框开关 全局
  const open = SetingStore((state) => state.OpenSetDialog)
  const setOpen = SetOpenDialogState
  // i18n
  const { t } = useTranslation()
  // 存储的key url
  const apikey = SetingStore.getState().OpenAiAPIKey //((state) => state.OpenAiAPIKey)
  const baseurl = SetingStore.getState().BaseURL //((state) => state.BaseURL)
  // 临时key url 关联组件
  const [key, setKey] = useState(apikey)
  const [url, setUrl] = useState(baseurl)
  // 网址正则
  const rexp: RegExp =
    /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/

  // 验证状态
  const [keystate, setKeystate] = useState(InputState.None)
  const [urlstate, setUrlstate] = useState(InputState.None)
  const [test, setTest] = useState(false)
  // 测试函数 完成回调callback
  const testkey = (
    key,
    tempurl,
    enter: boolean = false,
    overcall: () => void = null as never
  ): void => {
    // 设置超时
    setTimeout(() => {
      if (!test) return
      setSkvalue('base url reques time out!')
      setOpensk(true)
      setTest(false)
    }, 10000)
    // 测试API KEY IPC
    window.electron.ipcRenderer
      .invoke('test_openai_key', { key: key, url: tempurl })
      .then((models) => {
        console.log(`${key},${tempurl},${models}`)

        setKeystate(InputState.Success)
        setUrlstate(InputState.Success)
        // 设置全局可用模型
        enter ? SetModels(models) : null
        // 设置全局key状态
        enter ? SetAppState(KeyState.Setkey) : null
      })
      .catch((error) => {
        // 401 表示base url 正确,Key验证失败
        if (error.message?.indexOf('401') > 0) {
          setUrlstate(InputState.Success)
          setKeystate(InputState.Warning)
        }
        // 404,400 表示base url 错误
        if (error.message?.indexOf('404') > 0 || error.message?.indexOf('400') > 0) {
          setKeystate(InputState.None)
          setUrlstate(InputState.Warning)
        }
        // 设置全局key状态
        enter ? SetAppState(KeyState.None) : null
        console.log(error)
        // 测试完成
      })
      .finally(() => {
        // 测试完成
        setTest(false)
        overcall ? overcall() : null
      })
  }
  // 提示消息
  const [opensk, setOpensk] = useState(false)
  const [skvalue, setSkvalue] = useState('')
  return (
    <Modal
      open={open}
      onClose={(_event, reason) => {
        if (reason != 'backdropClick') setOpen(false)
      }}
    >
      <ModalDialog sx={{ width: '560px' }}>
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Sheet>
          <DialogTitle>{t('seting.title')}</DialogTitle>
          <DialogContent
            sx={{ display: 'flex', flexDirection: 'row', mb: '30px', justifyItems: 'flex-start' }}
          >
            <Typography
              level="body-sm"
              endDecorator={
                <Link
                  component="button"
                  onClick={() => {
                    // 打开购买链接
                    window.electron.ipcRenderer.invoke('invoke_openurl', t('seting.desclinkurl'))
                  }}
                  sx={{ ml: 0 }}
                >
                  {t('seting.desclink')}
                </Link>
              }
            >
              {t('seting.desc')}
            </Typography>
          </DialogContent>
          <Stack spacing={2}>
            <FormLabel>{t('seting.apikeydesc')}</FormLabel>
            <Input
              onChange={(e) => setKey(e.target.value)}
              autoFocus
              required
              defaultValue={key === '' ? undefined : key}
              spellCheck={false}
              placeholder={t('seting.apikeyplancehold')}
              endDecorator={<InputEnd state={keystate} />}
            />
            <FormLabel>{t('seting.baseurldesc')}</FormLabel>
            <Input
              onChange={(e) => setUrl(e.target.value)}
              error={!rexp.test(url)}
              required
              defaultValue={url === '' ? t('seting.baseurlplancehold') : url}
              placeholder={t('seting.baseurlplancehold')}
              spellCheck={false}
              endDecorator={<InputEnd state={urlstate} />}
            />
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Button
                sx={{ width: '45%' }}
                disabled={test}
                onClick={() => {
                  // 正在测试
                  setTest(true)
                  const tempurl = url === '' ? t('seting.baseurlplancehold') : url
                  testkey(key, tempurl)
                }}
              >
                {t('seting.test')}
              </Button>
              <Button
                sx={{ width: '45%' }}
                disabled={test}
                onClick={() => {
                  setTest(true)
                  const tempurl = url === '' ? t('seting.baseurlplancehold') : url
                  SetBaseURL(tempurl)
                  SetOpenAiApiKey(key)
                  // close dialog
                  testkey(key, tempurl, true, () => {
                    setOpen(false)
                  })
                }}
              >
                {t('seting.submit')}
              </Button>
            </Stack>
          </Stack>
        </Sheet>
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
            display: test ? 'flex' : 'none'
          }}
        />
        <Snackbar
          autoHideDuration={3000}
          onClose={() => setOpensk(false)}
          open={opensk}
          color="danger"
          variant="soft"
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          {skvalue}
        </Snackbar>
      </ModalDialog>
    </Modal>
  )
}
