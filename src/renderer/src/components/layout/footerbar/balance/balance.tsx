// import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'
import { Link, Stack, Typography } from '@mui/joy'
import { useTranslation } from 'react-i18next'
// import { SystemInfoStore } from '@renderer/components/public/systemstore'

export default function Balance(): JSX.Element {

  const { t } = useTranslation()
  return (
    <Stack direction="row" alignItems="center" justifyContent="flex-start">
      <Typography fontSize="12px" sx={{ mr: 1 }}>
        <Link
          onClick={() => {
            window.electron.ipcRenderer.invoke(
              'invoke_openurl',
              'https://platform.openai.com/usage'
            )
          }}
        >
          {t('footer.balance')}
        </Link>
      </Typography>
      {/* <SvgIcons d={SvgPathMap.AttachMoney} sx={{ height: '14px' }} />
      <Typography fontSize="12px">18.32</Typography>
      <Typography fontSize="12px" marginLeft="5px">
        {email}
      </Typography> */}
    </Stack>
  )
}
