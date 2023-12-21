import { Card, Typography, IconButton, Avatar } from '@mui/joy'
import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'
import { AssistantDialog } from '../assistantdialog'

import { useState } from 'react'
import log from 'electron-log/renderer'
interface AssistantProp {
  children: JSX.Element | null
  assistant: System.Assistant
}

export function AssistantCard(props: AssistantProp): JSX.Element {
  const [open, setOpen] = useState(false)
  const { assistant } = props
  log.info(assistant.AssistantBase.ImagePath)
  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      sx={{
        width: 140,
        height: 40,
        mt: '10px',
        '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' }
      }}
    >
      <Avatar
        alt={assistant.AssistantBase.Name as string}
        src={assistant.AssistantBase.ImagePath as string}
      />
      <Typography fontSize="h4">{props.assistant.AssistantBase.Name}</Typography>
      <IconButton
        size="sm"
        onClick={() => {
          setOpen(!open)
        }}
      >
        <SvgIcons d={SvgPathMap.Info} />
      </IconButton>
      <AssistantDialog
        assistent={assistant}
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      />
    </Card>
  )
}
