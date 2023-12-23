import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/joy'
// https://fonts.google.com/icons
// import PeopleOutline from '@mui/icons-material/PeopleOutline'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AssistantCard } from './assistantcard/assistantcard'
import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'
import { AssistantsStore } from '@renderer/components/public/assistantstore'
import { SystemStore } from '@renderer/components/public/systemstore'

import log from 'electron-log/renderer'

export default function AssistantItem(): JSX.Element {
  const { t } = useTranslation()
  // 当前展开的列表
  const [index, setIndex] = useState<number | null>(0)
  // 保存所有助手ID
  const [assisentids, setAssisentids] = useState(new Array<string>())
  const InsertAssistant = AssistantsStore((state) => state.InsertAssistant)
  const updateAssistantID = SystemStore((state) => state.updateAssistantID)

  useEffect(() => {
    window.electron.ipcRenderer.invoke('invoke_assistants').then((resultassistents) => {
      log.info(resultassistents)
      const ids: Array<string> = []
      for (const assistent of resultassistents) {
        const assistant: System.Assistant = {
          AssistantBase: assistent
        }
        log.info(assistant)
        // 插入store
        InsertAssistant(assistant)
        ids.push(assistant.AssistantBase.AssistantID as string)
      }
      setAssisentids(ids)
      // 加载后默认选择第一个助手
      updateAssistantID(ids[0])
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
        {assisentids.map((id) => (
          <AssistantCard key={id} assistantid={id}>
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
