import { SystemInfoStore } from '@renderer/components/public/systemstore'
import MessageInput from './messageinput/messageinput'
import { AssistantsStore } from '@renderer/components/public/assistantstore'
export default function ChatInput(): JSX.Element {
  // 获取当前选择的Assistants
  const assistantid = SystemInfoStore((state) => state.AssistantID)
  const assistant = AssistantsStore((state) => state.Assistants.get(assistantid))
  return <MessageInput assistant={assistant}></MessageInput>
}
