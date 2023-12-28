import {
  Button,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Input,
  Link,
  Modal,
  Typography,
  ModalDialog,
  Stack
} from '@mui/joy'
import { useTranslation } from 'react-i18next'

import { GetOpenAiApiKeyState, SetOpenAiApiKeyState } from '@renderer/components/public/setingstore'
import { useState } from 'react'
export function SetOpenAiAPIKeyDialog(): JSX.Element {
  const open = GetOpenAiApiKeyState()
  const setOpen = SetOpenAiApiKeyState
  const { t } = useTranslation()
  const [apikey, setApiKey] = useState('')
  const [baseurl, setBaseurl] = useState('')
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <DialogTitle>{t('seting.title')}</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'row', m: 0, p: 0, justifyItems: 'flex-start' }}
        >
          <Typography
            level="body-sm"
            endDecorator={
              <Link
                component="button"
                onClick={() => {
                  // console.log(`open:${t('seting.desclinkurl')}`)
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
        <form
          onSubmit={() => {
            // event.preventDefault()
            const url = baseurl === '' ? t('seting.baseurlplancehold') : baseurl
            console.log(apikey)
            console.log(`baseurl:${url}`)
            setOpen(false)
          }}
        >
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>{t('seting.apikeydesc')}</FormLabel>
              <Input
                type="text"
                onChange={(e) => setApiKey(e.target.value)}
                autoFocus
                required
                spellCheck={false}
                placeholder={t('seting.apikeyplancehold')}
              />
            </FormControl>
            <FormControl>
              <FormLabel>{t('seting.baseurldesc')}</FormLabel>
              <Input
                onChange={(e) => setBaseurl(e.target.value)}
                defaultValue={t('seting.baseurlplancehold')}
                placeholder={t('seting.baseurlplancehold')}
                spellCheck={false}
              />
            </FormControl>
            <Button type="submit">{t('seting.submit')}</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  )
}
