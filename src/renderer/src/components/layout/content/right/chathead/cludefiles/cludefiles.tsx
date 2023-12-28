import { Sheet, Stack, Typography } from '@mui/joy'
import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'
function BoxFiles(): JSX.Element {
  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="center" marginLeft="3px">
      <SvgIcons fontSize="small" d={SvgPathMap.Note}></SvgIcons>
      <Typography sx={{ fontSize: '10px' }}>系统文件</Typography>
    </Stack>
  )
}

export function CludeFiles(): JSX.Element {
  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-end"
      width="100%"
      marginLeft="3px"
    >
      <SvgIcons color="success" d={SvgPathMap.CloudDone}></SvgIcons>
      <Sheet sx={{ mr: '15px' }}></Sheet>
      <BoxFiles key="1"></BoxFiles>
    </Stack>
  )
}
