import { Box, Chip, Stack, Typography } from '@mui/joy'
import { MessageType } from '../chatlist'
// <Sheet variant="plain" color="neutral" sx={{ height:1,p: 4 }}>
// {children}
// </Sheet>
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
        <Chip
          color={isuser ? 'primary' : 'neutral'}
          onClick={function () {
            null
          }}
          variant={isuser ? 'solid' : 'soft'}
          sx={{
            borderTopRightRadius: isuser ? 0 : 'lg',
            borderTopLeftRadius: isuser ? 'lg' : 0,
            maxWidth: '80%'
          }}
        >
          <Box m="3px">
            <Typography level="body-md" fontWeight="400" sx={{ whiteSpace: 'normal' }}>
              {props.msg.content[0].text.value}
            </Typography>
          </Box>
        </Chip>
      </Stack>
    </Box>
  )
}
