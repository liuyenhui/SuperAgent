import { Sheet, Stack, Typography } from '@mui/joy'
import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'

function BoxFunction(): JSX.Element {
  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="center" marginLeft="3px">
      <SvgIcons fontSize="small" d={SvgPathMap.Sensors}></SvgIcons>
      <Typography sx={{ fontSize: '10px' }}>抖音API</Typography>
    </Stack>
  )
}
export function Functions(): JSX.Element {
  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-end"
      width="100%"
      marginLeft="3px"
    >
      <SvgIcons color="success" d={SvgPathMap.Function}></SvgIcons>
      <Sheet sx={{ mr: '15px' }}></Sheet>
      <BoxFunction key="1"></BoxFunction>
    </Stack>
  )
}
