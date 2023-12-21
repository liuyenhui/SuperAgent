import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/joy'
// https://fonts.google.com/icons
// import PeopleOutline from '@mui/icons-material/PeopleOutline'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AssistantCard } from './assistantcard/assistantcard'
import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'
import { AssistantsStore } from '@renderer/components/public/assistantstore'
import log from 'electron-log/renderer'

export default function AssistantItem(): JSX.Element {
  const { t } = useTranslation()
  // 当前展开的列表
  const [index, setIndex] = useState<number | null>(0)
  const [assistantarray, setAssistantarray] = useState<System.Assistant[]>(null as never)
  const InsertAssistant = AssistantsStore((state) => state.InsertAssistant)
  useEffect(() => {
    window.electron.ipcRenderer.invoke('invoke_assistants').then((resultassistents) => {
      log.info(resultassistents)
      const arr: Array<System.Assistant> = []
      for (const assistent of resultassistents) {
        const assistant: System.Assistant = {
          AssistantBase: assistent
        }
        log.info(assistant)
        // 插入store
        InsertAssistant(assistant)
        arr.push(assistant)
      }
      // 设置本组件的state
      setAssistantarray(arr)
    })
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
        {assistantarray?.map((assisent, index) => (
          <AssistantCard key={index} assistant={assisent}>
            <div></div>
          </AssistantCard>
        ))}
        {/* <AssistantCard name="对话"></AssistantCard>
        <AssistantCard name="Excel助手"></AssistantCard>
        <AssistantCard name="教师助手"></AssistantCard> */}
      </AccordionDetails>
    </Accordion>
  )
}
