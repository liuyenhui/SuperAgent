import { Accordion, AccordionDetails, AccordionSummary } from '@mui/joy'

type AssistantItemProps = {
  Title: string
  Children: JSX.Element
}
export default function AssistantItem(props: AssistantItemProps): JSX.Element {
  return (
    <Accordion sx={{ height: 'auto' }}>
      <AccordionSummary sx={{ height: 'auto' }}>{props.Title}</AccordionSummary>
      <AccordionDetails sx={{ height: 'auto' }}>{props.Children}</AccordionDetails>
    </Accordion>
  )
}
