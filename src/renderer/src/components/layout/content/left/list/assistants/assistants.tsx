import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/joy'
// https://fonts.google.com/icons
import PeopleOutline from '@mui/icons-material/PeopleOutline'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AssistantCard } from './assistantcard/assistantcard'

// import {AssistantCard } from "@/components/layout/content/left/list/assistants/assistantcard/assistantcard"

export default function AssistantItem(): JSX.Element {
  const { t } = useTranslation()
  const [index, setIndex] = useState<number | null>(0)
  return (
    <Accordion
      expanded={index === 0}
      onChange={(_event, expanded) => {
        setIndex(expanded ? 0 : null)
      }}
      sx={{ height: 'auto' }}
    >
      <AccordionSummary sx={{ height: 'auto' }}>
        <PeopleOutline />
        <Typography fontSize="14px">{t('list.assisants')}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ height: 'auto' }}>
        <AssistantCard Name="对话"></AssistantCard>
        <AssistantCard Name="Excel助手"></AssistantCard>
        <AssistantCard Name="教师助手"></AssistantCard>
      </AccordionDetails>
    </Accordion>
  )
}
