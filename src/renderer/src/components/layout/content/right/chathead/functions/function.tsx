import { IconButton, Sheet, Stack, Typography } from '@mui/joy'
import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'

function BoxFunction(): JSX.Element {
  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="center" marginLeft="3px">
      <SvgIcons fontSize="small" d={SvgPathMap.Sensors}></SvgIcons>
      <Typography sx={{ fontSize: '10px' }}>抖音API</Typography>
    </Stack>
  )
}
export function Functions(props: { assistant: System.Assistant }): JSX.Element {
  const { assistant } = props
  console.log(assistant)
  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      width="100%"
      height="100%"
      marginLeft="3px"
    >
      <IconButton
        variant="plain"
        size="sm"
        // disabled={filedisabled}
        onClick={() => {
          // setOpen(true)
        }}
      >
        <SvgIcons color="success" d={SvgPathMap.Function}></SvgIcons>
      </IconButton>
      <Sheet sx={{ mr: '15px' }}></Sheet>
      <BoxFunction key="1"></BoxFunction>
    </Stack>
  )
}
