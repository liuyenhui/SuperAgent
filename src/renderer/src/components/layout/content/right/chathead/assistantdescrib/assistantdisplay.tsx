import { Dropdown, Grid, Menu, MenuButton, MenuItem, Typography } from '@mui/joy'
import { UpdateAssistantModel } from '@renderer/components/public/assistantstore'
import { SetingModelType, SetingStore } from '@renderer/components/public/setingstore'
import { useState } from 'react'

export interface ChatPropType {
  assistant: System.Assistant
}
// 名称及提示词
export function AssistantDescrib(props: ChatPropType): JSX.Element {
  const { assistant } = props
  const [open, setOpen] = useState(false)
  const clickitem = (model: SetingModelType): void => {
    console.log(model.id)
    UpdateAssistantModel(assistant.AssistantBase.AssistantID, model.name, model.id)
    setOpen(false)
  }
  return (
    <Grid sx={{ userSelect: 'none' }} spacing={0.2}>
      <Typography level="title-sm" id="card-description">
        {assistant?.AssistantBase.Name}
        <Dropdown open={open}>
          <MenuButton
            onMouseEnter={() => {
              setOpen(true)
            }}
            variant="outlined"
            size="sm"
            sx={{ ml: "5px" }}
          >
            {
              SetingStore.getState().SetingModel.findLast(
                (value) => value.id === assistant.AssistantBase.Model
              )?.name
            }
          </MenuButton>
          <Menu variant="plain" size="sm" onMouseLeave={() => setOpen(false)}>
            {SetingStore.getState().SetingModel.map((model) => (
              <MenuItem
                key={model.id}
                onClick={() => {
                  clickitem(model)
                }}
              >
                <span>{model.name}</span>
              </MenuItem>
            ))}
          </Menu>
        </Dropdown>
      </Typography>
      <Typography
        noWrap
        level="body-sm"
        aria-describedby="card-description"
        fontSize={'12px'}
        // sx={{ textOverflow: 'ellipsis' }}
      >
        <span>Instructions:</span> {assistant?.AssistantBase.Prompt}
      </Typography>
    </Grid>
  )
}
