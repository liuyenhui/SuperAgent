import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/joy'
// https://fonts.google.com/icons
// import PeopleOutline from '@mui/icons-material/PeopleOutline'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AssistantCard } from './assistantcard/assistantcard'
import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'
import { AssistantsStore } from '@renderer/components/public/assistantstore'
import { UpdateSysinfo} from '@renderer/components/public/systemstore'

export default function AssistantItem(): JSX.Element {
  const { t } = useTranslation()
  // 当前展开的列表
  const [index, setIndex] = useState<number | null>(0)
  // 保存所有助手ID
  const assistants = Array.from(AssistantsStore((state) => state.Assistants).entries())
  useEffect(() => {
    // 加载后默认选择第一个助手,随后会渲染
    UpdateSysinfo('AssistantID', assistants[0][0])
  }, [])

  return (
    <Accordion
      expanded={index === 0}
      onChange={(_event, expanded) => {
        setIndex(expanded ? 0 : null)
      }}
      sx={{ height: '100%' }}
    >
      <AccordionSummary sx={{ height: 'auto' }}>
        <SvgIcons d={SvgPathMap.Pople} />
        <Typography fontSize="14px">{t('list.assisants')}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ height: '100%' }}>
        {assistants.map((id) => (
          <AssistantCard key={id[0]} assistantid={id[0]}>
            <div></div>
          </AssistantCard>
        ))}
      </AccordionDetails>
    </Accordion>
  )
}
