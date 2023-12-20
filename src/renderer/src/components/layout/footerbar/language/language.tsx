import { Select } from '@mui/joy'
import Option from '@mui/joy/Option'
import { KeyboardArrowUp } from '@mui/icons-material'
import i18n from 'i18next'
export default function Language(): JSX.Element {
  return (
    <Select
      variant="soft"
      defaultValue="zh"
      indicator={<KeyboardArrowUp />}
      size="sm"
      sx={{
        mt: '1px',
        mr: '1px',
        fontSize: '12px'
      }}
      onChange={(_event, value) => {
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
