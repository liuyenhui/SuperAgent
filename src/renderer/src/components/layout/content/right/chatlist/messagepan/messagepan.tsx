import { Box, Stack } from '@mui/joy'
import { MessageContentUser } from './messageuser'
import { MessageContentAssistent } from './messageassistant'

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
