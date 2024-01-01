import { Avatar, Badge, Box, Button, Card, Sheet, Stack, Typography } from '@mui/joy'
import iconfile from '@renderer/assets/chatgpt.png'
import { LEFT_HEAD_HEIGHT } from '@renderer/components/public/constants'
import { SystemInfoStore } from '@renderer/components/public/systemstore'
import { SetingStore, SetOpenDialogState, KeyState } from '@renderer/components/public/setingstore'

export default function HeadView(): JSX.Element {
  const update = SystemInfoStore((state) => state.update)
  const setOpen = SetOpenDialogState
  const userstate = SetingStore((state) => state.UserState)

  return (
    <Box height={LEFT_HEAD_HEIGHT}>
      <Card sx={{ height: '100%', m: '2 0 2', p: 0 }} orientation="horizontal">
        <Sheet
          variant="plain"
          component="button"
          onClick={() => {
            // 打开配置API Dialog
            setOpen(true)
          }}
          sx={{
            ml: '5px',
            border: 'hidden'
          }}
        >
          <Badge
            badgeInset="22%"
            size="sm"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            color={userstate == KeyState.None ? 'warning' : 'success'}
          >
            <Avatar
              alt="Remy Sharp"
              sx={{
                m: 1,
                '&:hover': { boxShadow: ' 0px 0px 3px', borderColor: 'rgba(0, 0, 0, 0.24)' }
              }}
              src={iconfile}
            />
          </Badge>
        </Sheet>
        <Stack direction="column" justifyContent="center" alignItems="center" sx={{ m: 0 }}>
          <Button
            color="neutral"
            onClick={function () {
              update('Email', 'new beijing email')
              console.log('gpt click!')
            }}
            size="sm"
            variant="outlined"
            sx={{ mb: '3px' }}
          >
            GPT 3.5
          </Button>

          <Typography fontSize="12px">API Version:1.0.4</Typography>
        </Stack>
      </Card>
    </Box>
  )
}
