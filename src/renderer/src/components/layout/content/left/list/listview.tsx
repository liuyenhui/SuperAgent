import { AccordionGroup, Sheet } from '@mui/joy'
import AssistantItem from './assistants/assistants'
import Files from './files/files'
import Images from './images/images'

import { LEFT_CONTENT_HEIGHT } from '@renderer/components/public/constants'
export default function ListView(): JSX.Element {
  return (
    <Sheet
      variant="outlined"
      sx={{ width: 'auto', height: LEFT_CONTENT_HEIGHT, overflow: 'hidden' }}
    >
      <AccordionGroup sx={{ height: 'auto' }}>
        <AssistantItem></AssistantItem>
        <Images></Images>
        <Files></Files>

        {/* <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem>
        <AssistantItem></AssistantItem> */}
      </AccordionGroup>
    </Sheet>
  )
}
