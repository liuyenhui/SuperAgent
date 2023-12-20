import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/joy'
// https://fonts.google.com/icons
import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'
import { useTranslation } from 'react-i18next'
export default function Images(): JSX.Element {
  const { t } = useTranslation()

  return (
    <Accordion sx={{ height: 'auto' }}>
      <AccordionSummary sx={{ height: 'auto' }}>
        <SvgIcons d={SvgPathMap.Panorama} />
        <Typography fontSize="14px">{t('list.images')}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ height: 'auto' }}>对话 Excel表 教师助手</AccordionDetails>
    </Accordion>
  )
}
