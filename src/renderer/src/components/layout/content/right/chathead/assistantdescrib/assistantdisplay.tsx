import {
  ButtonGroup,
  Divider,
  Dropdown,
  Grid,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  Button,
  Modal,
  ModalDialog,
  Stack,
  Tooltip,
  Typography,
  Box,
  LinearProgress
} from '@mui/joy'
import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'
import {
  UpdateAssistantCodeInterpreter,
  UpdateAssistantModel,
  UpdateAssistantThreadID
} from '@renderer/components/public/assistantstore'
import { DeleteThread, InsertThread, MessageStore } from '@renderer/components/public/messagestore'
import { SetingModelType, SetingStore } from '@renderer/components/public/setingstore'
import { useState } from 'react'

export interface ChatPropType {
  assistant: System.Assistant
}
// 名称及提示词
export function AssistantDescrib(props: ChatPropType): JSX.Element {
  const { assistant } = props
  const [opendialog, setOpenDialog] = useState(false)
  const [deleteing, setDeleteing] = useState(false)

  return (
    <Grid sx={{ userSelect: 'none' }} spacing={0.2}>
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Typography noWrap level="title-sm" id="card-description">
          {assistant?.AssistantBase.Name}
        </Typography>
        <ButtonGroup
          size="sm"
          variant="plain"
          aria-label="button group"
          sx={{ '--ButtonGroup-separatorSize': '0px' }}
          // sx={{ '--ButtonGroup-radius': '40px' }}
        >
          <ModelButton {...props} />
          <Divider orientation="vertical" />
          <CodeInterpreterButton {...props} />
          <Divider orientation="vertical" />
          <DeleteMessagesButton {...props} setOpen={setOpenDialog} />
        </ButtonGroup>
      </Stack>
      <Typography
        noWrap
        level="body-sm"
        aria-describedby="card-description"
        fontSize={'12px'}
        // sx={{ textOverflow: 'ellipsis' }}
      >
        {`Instructions:${assistant?.AssistantBase.Prompt}`}
      </Typography>
      <Modal open={opendialog} onClose={() => setOpenDialog(false)}>
        <ModalDialog>
          <Box>
            <Typography level="title-md">
              {`Delete all message of assistant ${assistant?.AssistantBase.Name}?`}
            </Typography>
          </Box>
          <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} spacing={4}>
            <Button
              size="sm"
              disabled={deleteing}
              onClick={() => {
                setDeleteing(true)
                const thread_id = assistant?.AssistantBase.MetaData['thread_id']
                const assistant_id = assistant?.AssistantBase.AssistantID
                // 删除本地缓存
                // DeleteMessages(thread_id)
                // 发送异步消息,未处理错误
                window.electron.ipcRenderer
                  .invoke('invoke_thread_message_delete', {
                    assistant_id: assistant_id,
                    thread_id: thread_id
                  })
                  .then((result) => {
                    const { AssistantID, NewThreadID } = result
                    // 插入新线程
                    InsertThread(NewThreadID, [])
                    // 更新助手
                    UpdateAssistantThreadID(AssistantID, NewThreadID)
                    //删除线程
                    DeleteThread(thread_id)
                    console.log(result)
                    setDeleteing(false)
                    setOpenDialog(false)
                  })
                  .catch(() => {
                    setDeleteing(false)
                    setOpenDialog(true)
                  })
              }}
            >
              Yes
            </Button>
            <Button
              size="sm"
              disabled={deleteing}
              onClick={() => {
                setDeleteing(false)
                setOpenDialog(false)
              }}
            >
              Cancel
            </Button>
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
              display: deleteing ? 'flex' : 'none'
            }}
          />
        </ModalDialog>
      </Modal>
    </Grid>
  )
}
function ModelButton(props: { assistant: System.Assistant }): JSX.Element {
  const { assistant } = props
  const [open, setOpen] = useState(false)
  const clickitem = (model: SetingModelType): void => {
    console.log(model.id)
    UpdateAssistantModel(assistant.AssistantBase.AssistantID, model.name, model.id)
    setOpen(false)
  }
  return (
    <Dropdown open={open}>
      <MenuButton
        onMouseEnter={() => {
          setOpen(true)
        }}
        variant="plain"
        size="sm"
        sx={{ m: '0', fontSize: '10px' }}
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
            sx={{ fontSize: '10px' }}
          >
            <span>{model.name}</span>
          </MenuItem>
        ))}
      </Menu>
    </Dropdown>
  )
}

function CodeInterpreterButton(props: { assistant: System.Assistant }): JSX.Element {
  const { assistant } = props
  const open = assistant?.AssistantBase.CodeInterpreter

  return (
    <Tooltip
      arrow
      enterDelay={100}
      // placement="bottom-start"
      variant="plain"
      title="Code Interpreter"
    >
      <IconButton
        onClick={() => {
          UpdateAssistantCodeInterpreter(assistant?.AssistantBase.AssistantID as string)
        }}
        size="sm"
        color={open ? 'success' : 'neutral'}
      >
        <SvgIcons d={open ? SvgPathMap.ToggleOn : SvgPathMap.ToggleOff}></SvgIcons>
      </IconButton>
    </Tooltip>
  )
}

function DeleteMessagesButton(props: {
  assistant: System.Assistant
  setOpen: (open: boolean) => void
}): JSX.Element {
  const { assistant } = props
  const thread = MessageStore((state) =>
    state.threads.find((thread) => {
      return thread.thread_id == assistant?.AssistantBase.MetaData['thread_id']
    })
  )
  const isEnable = thread && thread.messages.length > 0

  return (
    <Tooltip
      arrow
      enterDelay={100}
      // placement="bottom-start"
      variant="plain"
      title="Delete all messages"
    >
      <IconButton
        onClick={() => {
          props.setOpen(true)
        }}
        size="sm"
        color={isEnable ? 'success' : 'neutral'}
        disabled={!isEnable}
      >
        <SvgIcons d={SvgPathMap.Delete}></SvgIcons>
      </IconButton>
    </Tooltip>
  )
}
