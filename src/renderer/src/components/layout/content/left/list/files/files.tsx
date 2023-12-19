import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/joy'
// https://fonts.google.com/icons
import FileOpen from '@mui/icons-material/FileOpen'
import { useTranslation } from 'react-i18next'
export default function Files(): JSX.Element {
  const { t } = useTranslation()

  return (
    <Accordion sx={{ height: 'auto' }}>
      <AccordionSummary sx={{ height: 'auto' }}>
        <FileOpen />
        <Typography fontSize="14px">{t('list.files')}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ height: 'auto' }}>对话 Excel表 教师助手</AccordionDetails>
    </Accordion>
  )
}
