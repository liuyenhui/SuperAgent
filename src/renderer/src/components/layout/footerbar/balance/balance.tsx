import AttachMoney from '@mui/icons-material/AttachMoney'
import { Link, Stack, Typography } from '@mui/joy'
import { useTranslation } from 'react-i18next'
import { SystemInfoStore } from '@renderer/components/public/systemstore'

export default function Balance(): JSX.Element {
  // const email = SystemInfoStore.getState().info.Email
  const email = SystemInfoStore((state) => state.info.Email)

  const { t } = useTranslation()
  return (
    <Stack direction="row" alignItems="center" justifyContent="flex-start">
      <Typography fontSize="12px" sx={{ mr: 1 }}>
        <Link href="">{t('footer.balance')}</Link>
      </Typography>
      <AttachMoney sx={{ fontSize: '16px' }} />
      <Typography fontSize="12px">18.32</Typography>
      <Typography fontSize="12px" marginLeft="5px">
        {email}
      </Typography>
    </Stack>
  )
}
