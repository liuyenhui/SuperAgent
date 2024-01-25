import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'

function MessageCreation(props: { message_creation: System.message_creation }): JSX.Element {
  const { message_creation } = props
  return <SvgIcons d={SvgPathMap.Message}>{message_creation.type}</SvgIcons>
}
function ToolCalls(props: { tool_calls: System.tool_calls }): JSX.Element {
  const { tool_calls } = props
  return <SvgIcons d={SvgPathMap.Function}>{tool_calls.type}</SvgIcons>
}
export function MessageStep(props: { step: System.Step }): JSX.Element {
  const { step } = props
  const select_step = (): JSX.Element => {
    switch (step.step_details.type) {
      case 'message_creation':
        return <MessageCreation message_creation={step.step_details}></MessageCreation>
      case 'tool_calls':
        return <ToolCalls tool_calls={step.step_details}></ToolCalls>
      default:
        return <></>
    }
  }
  return select_step()
}
