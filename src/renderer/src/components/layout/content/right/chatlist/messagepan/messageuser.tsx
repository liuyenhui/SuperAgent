import { Box, Chip, Stack, Typography } from '@mui/joy'
import moment from 'moment-timezone'
// 设置当前主机时区为 缺省时区
moment.tz.setDefault()

export function MessageContentUser(props: { msg: System.Message }): JSX.Element {
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
