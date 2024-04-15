import { Button, Chip, Divider, Sheet, Stack, StepIndicator, Tooltip, Typography } from '@mui/joy'
import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'
import { MarkDown } from './markdownreact'
import { GetMessages } from '@renderer/components/public/messagestore'
import { useRef } from 'react'
import { RIGHT_CHAT_WIDTH } from '@renderer/components/public/constants'
/**
 * Step 步骤相关函数
 * @param props
 * @returns
 */
// message 图标
function MessageCreation(props: { message_creation: System.message_creation }): JSX.Element {
  const { message_creation } = props
  return (
    <SvgIcons sx={{ fontSize: '20px' }} d={SvgPathMap.Message}>
      {message_creation.type}
    </SvgIcons>
  )
}
// tools call图标
function ToolCalls(props: { tool_calls: System.tool_calls }): JSX.Element {
  const { tool_calls } = props
  return (
    <SvgIcons sx={{ fontSize: '20px' }} d={SvgPathMap.Function}>
      {tool_calls.type}
    </SvgIcons>
  )
}
// 返回步骤图标
function SeleteStep(props: { step: System.Step }): JSX.Element {
  const { step } = props
  let step_details: JSX.Element
  switch (step.step_details.type) {
    case 'message_creation':
      step_details = <MessageCreation message_creation={step.step_details}></MessageCreation>
      break
    case 'tool_calls':
      step_details = <ToolCalls tool_calls={step.step_details}></ToolCalls>
      break
    default:
      return <></>
  }
  return step_details
}
/**
 * 步骤详情相关函数
 * @param props
 * @returns
 */

function MessageDetails(props: { message: System.Message | undefined }): JSX.Element {
  const content = props.message?.content[0]
  if (!content) return <></>
  if (content.type == 'text') return <MarkDown marktext={content.text.value}></MarkDown>
  if (content.type == 'image_file')
    return <MarkDown marktext={content.image_file.file_id}></MarkDown>
  return <></>
}

function ToolsDetails(props: {
  tools: Array<System.Code_interpreter | System.Retrieval | System.FunctionCall>
}): JSX.Element {
  const { tools } = props
  return (
    <>
      {tools.map((tool, index) => {
        let result: JSX.Element = <></>
        switch (tool.type) {
          case 'code_interpreter':
            result = (
              <Stack direction="column" key={index} spacing={1}>
                <Stack direction="row" spacing={1}>
                  <Sheet>
                    <Chip sx={{ borderRadius: '50%' }}>{index + 1}</Chip>
                    <Typography level="title-sm">Code Interpreter</Typography>
                  </Sheet>
                  <Sheet>
                    <Chip color="success">Input</Chip>
                    <MarkDown
                      marktext={`\`\`\`python\n${tool.code_interpreter.input}\`\`\``}
                    ></MarkDown>
                    <Divider sx={{ mb: '5px' }} />
                    <Chip color="success">Output</Chip>
                    <Sheet>
                      {tool.code_interpreter.outputs.map((output, index) => {
                        if (output.type == 'logs')
                          return <MarkDown key={index} marktext={output.logs}></MarkDown>
                        // 输出图像
                        if (output.type == 'image')
                          return (
                            <Typography key={index} level="body-sm">
                              {output.image.file_id}
                            </Typography>
                          )
                        return <></>
                      })}
                    </Sheet>
                  </Sheet>
                </Stack>
                {/* <MarkDown marktext={tool.code_interpreter.outputs}></MarkDown> */}
              </Stack>
            )
            break
          case 'retrieval':
            result = (
              <Stack direction="column" key={index} spacing={1}>
                <Stack direction="row" spacing={1}>
                  <Sheet>
                    <Chip sx={{ borderRadius: '50%' }}>{index + 1}</Chip>
                    <Typography level="title-sm">Retrieval</Typography>
                  </Sheet>
                  <Sheet>
                    {/* 等待官方api 更新 https://platform.openai.com/docs/api-reference/runs/object  */}
                    <Chip color="success">Develop...</Chip>
                  </Sheet>
                </Stack>
              </Stack>
            )
            break
          case 'function':
            result = (
              <Stack direction="column" key={index} spacing={1}>
                <Stack direction="row" spacing={1}>
                  <Sheet>
                    <Chip sx={{ borderRadius: '50%' }}>{index + 1}</Chip>
                    <Typography level="title-sm">Function</Typography>
                  </Sheet>
                  <Sheet>
                    <Chip color="success">Description</Chip>
                    <Typography level="title-sm">{tool.function.name}</Typography>
                    <Divider sx={{ mb: '5px' }} />
                    <Chip color="success">Arguments</Chip>
                    <Typography level="title-sm">{tool.function.arguments}</Typography>
                    <Divider sx={{ mb: '5px' }} />
                    <Chip color="success">Output</Chip>
                    <Typography level="title-sm">{tool.function.output}</Typography>
                  </Sheet>
                </Stack>
              </Stack>
            )
            break
          default:
            result = <Stack key={index}></Stack>
        }
        return result
      })}
    </>
  )
}
// 显示步骤细节
function StepDetails(props: { step: System.Step }): JSX.Element {
  const { step } = props
  // const [content, setContent] = useState<string>('')
  let content
  // 步骤类型
  const steptype = step.step_details.type
  if (steptype == 'message_creation') {
    const message_id = step.step_details.message_creation.message_id
    const message = GetMessages(step.thread_id, message_id)
    content = <MessageDetails message={message}></MessageDetails>
    // message?.content[0].type == 'text'
    //   ? message.content[0].text.value
    //   : message?.content[0].image_file.file_id
  }
  if (steptype == 'tool_calls') {
    content = <ToolsDetails tools={step.step_details.tool_calls}></ToolsDetails>
    // step.step_details.tool_calls[0].type == 'code_interpreter'
    //   ? `\`\`\`python\n${step.step_details.tool_calls[0].code_interpreter.input}\`\`\``
    //   : ''
  }
  return (
    <Stack direction="column" spacing={2} p={2}>
      <Chip size="md" color={steptype == 'message_creation' ? 'primary' : 'warning'}>
        {steptype == 'message_creation' ? 'create message' : 'tools call'}
      </Chip>
      {content}
    </Stack>
  )
}
// 消息步骤显示
export function MessageStep(props: { step: System.Step; index: number }): JSX.Element {
  const { step, index } = props
  const buttonref = useRef<HTMLButtonElement>()
  return (
    <StepIndicator
      sx={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)' }}
    >
      <Tooltip
        placement="right-start"
        variant="outlined"
        size="sm"
        leaveDelay={300}
        arrow
        title={<StepDetails step={step}></StepDetails>}
        sx={{
          overflow: 'auto',
          // maxWidth: `${buttonref.current ? 700 - buttonref.current.offsetWidth : 400}px`,
          // maxHeight: `${buttonref.current ? 500 - buttonref.current.offsetHeight : 200}px`
          maxWidth: `calc(${RIGHT_CHAT_WIDTH} - 80px)`,
          maxHeight: '400px'
        }}
      >
        <Button
          ref={buttonref as never}
          sx={{ ml: 2, p: '2px', borderRadius: '30%' }}
          variant="plain"
          onClick={() => {}}
        >
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            alignItems="center"
            alignContent="center"
            width="100%"
            height="100%"
          >
            <Typography level="body-sm"> {index + 1}</Typography>
            <SeleteStep step={step}></SeleteStep>
          </Stack>
        </Button>
      </Tooltip>
    </StepIndicator>
  )
}
