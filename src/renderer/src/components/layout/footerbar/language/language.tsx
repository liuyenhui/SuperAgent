import { Select } from '@mui/joy'
import Option from '@mui/joy/Option'
import { KeyboardArrowUp } from '@mui/icons-material'
import i18n from 'i18next'
import { SystemInfoStore } from '@renderer/components/public/systemstore'
import { useEffect } from 'react'

export default function Language(): JSX.Element {
  const updateinfo = SystemInfoStore.getState().update
  const language = SystemInfoStore((state) => state.info.Language) as string
  useEffect(() => {
    i18n.changeLanguage(language)
  }, [])
  return (
    <Select
      variant="soft"
      defaultValue={language}
      indicator={<KeyboardArrowUp />}
      size="sm"
      sx={{
        mt: '1px',
        mr: '1px',
        fontSize: '12px'
      }}
      onChange={(_event, value) => {
        updateinfo('Language', value as string)
        value ? i18n.changeLanguage(value) : null
      }}
    >
      <Option
        value="en"
        sx={{
          m: '1px',
          fontSize: '12px'
        }}
      >
        English
      </Option>
      <Option
        value="zh"
        sx={{
          m: '1px',
          fontSize: '12px'
        }}
      >
        简体中文
      </Option>
    </Select>
  )
}
