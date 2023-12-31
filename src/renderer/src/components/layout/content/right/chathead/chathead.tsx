import {
  Avatar,
  ButtonGroup,
  Card,
  Divider,
  Grid,
  IconButton,
  Sheet,
  Stack,
  Tooltip,
  Typography
} from '@mui/joy'
import { RIGHT_HEAD_HEIGHT } from '@renderer/components/public/constants'
import { SvgPathMap, SvgIcons } from '@renderer/components/public/SvgIcons'
import { SystemInfoStore } from '@renderer/components/public/systemstore'
import { AssistantsStore } from '@renderer/components/public/assistantstore'
import { CludeFiles } from './cludefiles/cludefiles'
import { Functions } from './functions/function'
import log from 'electron-log'
interface ChatPropType {
  assistant: System.Assistant
}
// 侧边栏隐藏
function PopListView(): JSX.Element {
  const lefthidden = SystemInfoStore((state) => state.info.LeftHidden)
  const update = SystemInfoStore((state) => state.update)
  const onClick = (): void => {
    update('LeftHidden', !lefthidden)
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
  const UpdateAssistantCodeInterpreter = AssistantsStore(
    (state) => state.UpdateAssistantCodeInterpreter
  )
  // 获取Store中的 assistant
  const assistant = assistants.get(props.assistant?.AssistantBase.AssistantID)
  // 获取代码解释器开关状态
  const open = assistant?.AssistantBase.CodeInterpreter
  return (
    <Stack direction="column" justifyContent="center" alignItems="center" sx={{ p: '5px' }}>
      <Avatar alt={assistant?.AssistantBase.Name} src={assistant?.AssistantBase.ImagePath} />
      <Tooltip
        arrow
        enterDelay={500}
        placement="bottom-start"
        variant="plain"
        title="Code Interpreter"
      >
        <IconButton
          onClick={() => {
            UpdateAssistantCodeInterpreter(assistant?.AssistantBase.AssistantID as string)
          }}
          color={open ? 'success' : 'neutral'}
          sx={{ p: 0, minHeight: '18px', bottom: '-4px' }}
        >
          <SvgIcons d={open ? SvgPathMap.ToggleOn : SvgPathMap.ToggleOff}></SvgIcons>
        </IconButton>
      </Tooltip>
    </Stack>
  )
}
// 名称及提示词
function AssistantDescrib(props: ChatPropType): JSX.Element {
  const { assistant } = props

  return (
    <Grid sx={{ userSelect: 'none' }}>
      <Typography level="title-md" id="card-description">
        {assistant?.AssistantBase.Name}
      </Typography>
      <Typography
        noWrap
        level="body-sm"
        aria-describedby="card-description"
        // sx={{ textOverflow: 'ellipsis' }}
      >
        {assistant?.AssistantBase.Prompt}
      </Typography>
    </Grid>
  )
}

export default function ChatHead(): JSX.Element {
  const assistantid = SystemInfoStore((state) => state.info.AssistantID)
  log.info(assistantid)
  const assistant = AssistantsStore.getState().Assistants.get(assistantid)
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
