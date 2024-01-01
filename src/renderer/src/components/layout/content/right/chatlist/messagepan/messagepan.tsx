import { Avatar, Box, Chip, Stack, Typography } from '@mui/joy'
import { MessageType } from '../chatlist'
import { AssistantsStore } from '@renderer/components/public/assistantstore'

function MessageContentUser(props: { msg: MessageType }): JSX.Element {
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
          <Typography fontSize="12px" level="body-sm">12月26日 AM 11:30</Typography>
        </Stack>
        <Chip
          color="primary"
          onClick={function () {
            null
          }}
          variant="solid"
          sx={{
            borderTopRightRadius: 0,
            borderTopLeftRadius: 'lg'
          }}
        >
          <Box m="3px" p="3px">
            <Typography level="body-md" fontWeight="350" sx={{ whiteSpace: 'normal' }}>
              {props.msg.content[0].text.value}
            </Typography>
          </Box>
        </Chip>
      </Stack>
    </Stack>
  )
}

function MessageContentAssistent(props: { msg: MessageType }): JSX.Element {
  const assistant = AssistantsStore.getState().Assistants.get(props.msg.assistant_id)
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
          <Typography level="body-sm" fontSize="12px">
            ChatGPT 3.5
          </Typography>
          <Typography level="body-sm" fontSize="12px" mr="12px">
            12月26日 AM 11:30
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
            <Typography level="body-md" fontWeight="400" sx={{ whiteSpace: 'normal' }}>
              {props.msg.content[0].text.value}
            </Typography>
          </Box>
        </Chip>
      </Stack>
    </Stack>
  )
}

export function MessagePan(props: { msg: MessageType }): JSX.Element {
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
