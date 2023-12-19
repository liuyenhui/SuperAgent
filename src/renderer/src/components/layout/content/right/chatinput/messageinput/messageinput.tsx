import { Send } from '@mui/icons-material'
import { Box, Chip, Stack, Textarea, Typography } from '@mui/joy'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RIGHT_INPUT_HEIGHT } from '@renderer/components/public/constants'

export default function MessageInput(): JSX.Element {
  const { t } = useTranslation()
  // const SysInfo = useContext(SystemContext)

  const [value, setValue] = useState('')

  // 提交响应函数
  function submit(): void {
    console.log(value)
    // const msg:System.Message = {
    //   id:"99",
    //   type:"User",
    //   value:value
    // }
    // messages?.push(msg)
    // info.SystemData.Email = value
    // SysInfo.setSysinfo(info);
    // (SysInfo.Email as any).setEmail("北京")
  }

  return (
    <Textarea
      placeholder="Type something here…"
      minRows={3}
      maxRows={3}
      // 监听事件同步更改value状态
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(event) => {
        console.log(event.key)
      }}
      sx={{
        /// <reference path="" />

        width: '100%',
        height: RIGHT_INPUT_HEIGHT
      }}
      // value={msg}
      endDecorator={
        <Box
          sx={{
            display: 'flex',
            gap: 'var(--Textarea-paddingBlock)',
            pt: 'var(--Textarea-paddingBlock)',
            borderTop: '1px solid',
            borderColor: 'divider',
            flex: 'auto',
            alignItems: 'auto',
            justifyContent: 'center'
          }}
        >
          <Typography level="body-sm" variant="plain" color="primary" mt="5px">
            {t('chat.sendfiles')}
          </Typography>
          <Chip
            variant="plain"
            color="primary"
            size="sm"
            sx={{
              height: 'auto',
              mb: '5px',
              ml: 'auto'
            }}
            onClick={() => {
              console.log('submit')
              // 提交
              submit()
            }}
          >
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
              <Send sx={{ mr: '1px' }} />
              <Typography level="body-sm" variant="plain" color="primary">
                {t('chat.sendmessage')}
              </Typography>
            </Stack>
          </Chip>
        </Box>
      }
    />
  )
}
