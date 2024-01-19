import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  Chip,
  DialogContent,
  DialogTitle,
  Divider,
  FormLabel,
  Grid,
  Input,
  LinearProgress,
  Modal,
  ModalClose,
  ModalDialog,
  Sheet,
  Stack
} from '@mui/joy'
import { RIGHT_HEAD_HEIGHT } from '@renderer/components/public/constants'
import { SvgPathMap, SvgIcons } from '@renderer/components/public/SvgIcons'
import { SystemInfoStore, UpdateSysinfo } from '@renderer/components/public/systemstore'
import {
  AssistantsStore,
  UpdateAssistantNamePrompt
} from '@renderer/components/public/assistantstore'
import { CludeFiles } from './cludefiles/cludefiles'
import { Functions } from './functions/function'
import log from 'electron-log'
import { AssistantDescrib, ChatPropType } from './assistantdescrib/assistantdisplay'
import { useState } from 'react'
// 侧边栏隐藏
function PopListView(): JSX.Element {
  const lefthidden = SystemInfoStore((state) => state.LeftHidden)
  const onClick = (): void => {
    UpdateSysinfo('LeftHidden', !lefthidden)
  }
  return (
    <Sheet
      variant="soft"
      sx={{
        m: 0,
        p: 0,
        height: '100%',
        width: '15px'
      }}
    >
      <ButtonGroup onClick={onClick} sx={{ height: '100%', alignItems: 'center', p: 0 }}>
        <SvgIcons
          sx={{ width: '15px', p: 0, fontSize: '18px' }}
          d={lefthidden ? SvgPathMap.ChevronRight : SvgPathMap.ChevronLeft}
        ></SvgIcons>
      </ButtonGroup>
    </Sheet>
  )
}
// 头像
function AvatarImage(props: ChatPropType): JSX.Element {
  const assistants = AssistantsStore((state) => state.Assistants) //props.assistant
  // 获取Store中的 assistant
  const assistant = assistants.get(props.assistant?.AssistantBase.AssistantID)
  const [open, setOpen] = useState(false)
  // 获取代码解释器开关状态
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={'3px'}
      sx={{ p: '5px' }}
    >
      <Avatar
        sx={{ width: '30px', height: '30px' }}
        alt={assistant?.AssistantBase.Name}
        src={assistant?.AssistantBase.ImagePath}
      />
      <Chip
        variant="plain"
        onClick={() => {
          setOpen(true)
        }}
      >
        <SvgIcons color="success" fontSize={'small'} d={SvgPathMap.Edit}></SvgIcons>
      </Chip>
      {assistant ? (
        <EditDialog assistant={assistant} open={open} setOpen={setOpen}></EditDialog>
      ) : (
        <></>
      )}
    </Stack>
  )
}
function EditDialog(props: {
  assistant: System.Assistant
  open: boolean
  setOpen: (open: boolean) => void
}): JSX.Element {
  const [updating, setUpdating] = useState(false)
  const [name, setName] = useState(props.assistant.AssistantBase.Name)
  const [prompt, setPrompt] = useState(props.assistant.AssistantBase.Prompt)
  return (
    <Modal
      open={props.open}
      onClose={() => {
        props.setOpen(false)
        setUpdating(false)
      }}
    >
      <ModalDialog>
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <DialogTitle>Eidt assistant info</DialogTitle>
        <DialogContent>Modifi name and instructions of the assistant</DialogContent>

        <Stack spacing={2}>
          <FormLabel>Name</FormLabel>
          <Input
            autoFocus
            required
            defaultValue={props.assistant.AssistantBase.Name}
            onChange={(event) => {
              setName(event.currentTarget.value)
            }}
          />
          <FormLabel>Instructions</FormLabel>
          <Input
            required
            defaultValue={props.assistant.AssistantBase.Prompt}
            onChange={(event) => {
              setPrompt(event.currentTarget.value)
            }}
          />
          <Button
            type="submit"
            onClick={() => {
              setUpdating(true)
              // alert(`name:${name} prompt:${prompt}`)
              UpdateAssistantNamePrompt(
                props.assistant.AssistantBase.AssistantID,
                name,
                prompt
              ).then(() => {
                setUpdating(false)
                props.setOpen(false)
              })
            }}
            disabled={updating}
          >
            Submit
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
            display: updating ? 'flex' : 'none'
          }}
        />
      </ModalDialog>
    </Modal>
  )
}
export default function ChatHead(): JSX.Element {
  const assistantid = SystemInfoStore((state) => state.AssistantID)
  log.info(assistantid)
  const assistant = AssistantsStore((state) => state.Assistants.get(assistantid))
  log.info(`ChatHead getassistant id:${assistantid} name:${assistant?.AssistantBase.Name}`)
  return (
    <Sheet
      variant="soft"
      sx={{
        display: 'flex',
        borderBottom: '1px solid',
        borderColor: 'divider',
        width: '100%',
        height: RIGHT_HEAD_HEIGHT
      }}
    >
      <PopListView></PopListView>

      <Card
        variant="plain"
        orientation="horizontal"
        sx={{
          borderRadius: 0,
          gap: 0,
          p: 0,
          m: 0,
          width: '100%',
          height: 1,
          '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' }
        }}
      >
        <AvatarImage assistant={assistant as System.Assistant}></AvatarImage>
        <Stack direction="column" justifyContent="center" alignItems="flex-start" width="100%">
          <Grid container spacing={1} width="100%" height="auto">
            <Grid xs={5} md={5}>
              <AssistantDescrib assistant={assistant as System.Assistant}></AssistantDescrib>
            </Grid>

            <Divider orientation="vertical"></Divider>

            <Grid container xs={6} md={6}>
              <Stack
                direction="column"
                justifyContent="space-between"
                alignItems="flex-start"
                width="100%"
              >
                <CludeFiles></CludeFiles>
                <Divider sx={{ ml: '30px' }} orientation="horizontal"></Divider>
                <Functions></Functions>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Sheet>
  )
}
