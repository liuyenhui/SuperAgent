import { Sheet, Stack } from '@mui/joy'
import Balance from './balance/balance'
import Language from './language/language'
import { FOOTER_BAR_HEIGHT } from '@renderer/components/public/constants'

export default function FooterBar(): JSX.Element {
  return (
    <Sheet variant="outlined" sx={{ width: 'auto', height: FOOTER_BAR_HEIGHT }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ ml: 3 }}>
        <Balance />
        <Language />
      </Stack>
    </Sheet>
  )
}
