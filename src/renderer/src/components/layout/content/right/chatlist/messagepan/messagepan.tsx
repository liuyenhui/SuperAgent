import { Avatar, Box, Chip, Stack, Typography } from '@mui/joy'
import { AnimationText } from '@renderer/components/public/AnimationText'
import { AssistantsStore } from '@renderer/components/public/assistantstore'
import { PostMessage } from '@renderer/components/public/systemstore'
import moment from 'moment-timezone'
// 设置当前主机时区为 缺省时区
moment.tz.setDefault()

function MessageContentUser(props: { msg: System.Message }): JSX.Element {
  let outvalue = ''
  if (props.msg.content[0].type == 'text') {
    outvalue = props.msg.content[0].text.value
  }
  const messagestate = (props.msg.metadata as object)['MessageState']
  let color = 'warning'
  switch (messagestate) {
    case 'UserSend':
      color = 'warning'
      break
    case 'UserSendResult':
      color = 'primary'
      break
    default:
      color = 'warning'
      break
  }
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={{ maxWidth: '80%' }}
    >
      <Stack direction="column" alignItems="flex-end">
        <Stack
          direction="row"
          justifyContent="space-between"
          width="100%"
          maxWidth="100%"
          minWidth="240px"
          alignItems="flex-end"
          paddingRight="5px"
        >
          <Typography level="body-sm" fontSize="12px" ml="12px">
            User
          </Typography>
          <Typography fontSize="12px" level="body-sm">
            {moment(props.msg.created_at * 1000).format('MM/DD A hh:mm')}
          </Typography>
        </Stack>
        <Chip
          color={color as never}
          variant="solid"
          sx={{
            borderTopRightRadius: 0,
            borderTopLeftRadius: 'lg'
          }}
        >
          <Box m="3px" p="3px">
            <Typography level="body-md" fontWeight="350" sx={{ whiteSpace: 'normal' }}>
              {outvalue}
            </Typography>
          </Box>
        </Chip>
      </Stack>
    </Stack>
  )
}

function MessageContentAssistent(props: { msg: System.Message }): JSX.Element {
  let outvalue = ''
  if (props.msg.content[0].type == 'text') {
    outvalue = props.msg.content[0].text.value
  }
  if (!props.msg.assistant_id) {
    PostMessage('MessageContentAssistent props msg assistant_id is null')
    return <></>
  }
  const assistant = AssistantsStore((state) =>
    state.Assistants.get(props.msg.assistant_id as string)
  )
  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      sx={{ maxWidth: '80%' }}
    >
      <Avatar
        alt={assistant?.AssistantBase.Name}
        src={assistant?.AssistantBase.ImagePath}
        // src={imgfile}
      />
      <Stack direction="column" justifyContent="flex-start" alignItems="flex-start">
        <Stack
          direction="row"
          justifyContent="space-between"
          width="100%"
          maxWidth="100%"
          minWidth="240px"
          alignItems="flex-end"
          paddingRight="5px"
        >
          <Typography level="body-sm" fontSize="12px" ml={'5px'}>
            {assistant?.AssistantBase.Name}
          </Typography>
          <Typography level="body-sm" fontSize="12px" mr="12px">
            {moment(props.msg.created_at * 1000).format('MM/DD A hh:mm')}
          </Typography>
        </Stack>
        <Chip
          color="neutral"
          onClick={function () {
            null
          }}
          variant="soft"
          sx={{
            borderTopRightRadius: 'lg',
            borderTopLeftRadius: 0
          }}
        >
          <Box m="3px" p="3px">
            {(props.msg.metadata as object)['MessageState'] === 'WaitRun' ? (
              <Typography level="body-md" fontWeight="400" sx={{ whiteSpace: 'normal' }}>
                <AnimationText text={outvalue} stop={false} loop={true}></AnimationText>
              </Typography>
            ) : (
              <Typography level="body-md" fontWeight="400" sx={{ whiteSpace: 'normal' }}>
                {outvalue}
              </Typography>
            )}
          </Box>
        </Chip>
      </Stack>
    </Stack>
  )
}

export function MessagePan(props: { msg: System.Message }): JSX.Element {
  const isuser = props.msg.role === 'user'
  return (
    <Box width="100%">
      <Stack
        direction="row"
        spacing={1.5}
        display="flex"
        justifyContent={isuser ? 'flex-end' : 'flex-start'}
        alignItems="flex-start"
        m="5px"
      >
        {isuser ? (
          <MessageContentUser msg={props.msg} />
        ) : (
          <MessageContentAssistent msg={props.msg} />
        )}
      </Stack>
    </Box>
  )
}
