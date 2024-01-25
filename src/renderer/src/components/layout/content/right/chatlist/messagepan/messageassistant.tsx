import { Avatar, Box, Chip, CircularProgress, Stack, Step, Stepper, Typography } from '@mui/joy'
import { AnimationText } from '@renderer/components/public/AnimationText'
import { AssistantsStore } from '@renderer/components/public/assistantstore'
import { PostMessage } from '@renderer/components/public/systemstore'

import { MarkDown } from './markdownreact'
import moment from 'moment-timezone'
import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'
import { useState } from 'react'
import { MessageStep } from './messagestep'
moment.tz.setDefault()

type OpenStep = 'Open' | 'Close' | 'Loading'
function MessageRunStep(props: { msg: System.Message }): JSX.Element {
  const { msg } = props
  const [openstep, setOpenstep] = useState<OpenStep>('Close')
  // 减少渲染,在此更新run steps
  const [steps, setSteps] = useState<Array<System.Step>>([])
  console.log(msg.id)
  return (
    <Stack direction="column" justifyContent="center" alignItems="center" width="40px">
      {openstep == 'Loading' ? (
        <CircularProgress thickness={1} size="sm" />
      ) : (
        <Box>
          <Chip
            onClick={() => {
              if (openstep == 'Close') {
                setOpenstep('Loading')
                window.electron.ipcRenderer
                  .invoke('invoke_message_steps', {
                    thread_id: msg.thread_id,
                    run_id: msg.run_id
                  })
                  .then((steps) => {
                    setSteps(steps)
                    console.log(steps)
                    setOpenstep('Open')
                  })
                  .catch((error) => {
                    alert(error)
                  })
                // const interval = setInterval(() => {
                //   setOpenstep('Open')
                //   clearInterval(interval)
                // }, 3000)
              } else {
                setOpenstep('Close')
              }
            }}
            variant="plain"
            size="sm"
          >
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Typography sx={{ fontSize: '10px' }}>Step</Typography>
              <SvgIcons
                sx={{ fontSize: ' 14px', color: 'green' }}
                d={openstep == 'Close' ? SvgPathMap.ChevronDown : SvgPathMap.ChevronUp}
              ></SvgIcons>
            </Stack>
          </Chip>

          <Stepper
            sx={{ visibility: openstep == 'Close' ? 'hidden' : 'visible' }}
            orientation="vertical"
          >
            {steps.map((step) => {
              return (
                <Step key={step.id}>
                  <MessageStep step={step}></MessageStep>
                </Step>
              )
            })}
          </Stepper>
        </Box>
      )}
    </Stack>
  )
}

export function MessageContentAssistent(props: { msg: System.Message }): JSX.Element {
  let outvalue = ''
  if (props.msg.content[0].type == 'text') {
    outvalue = props.msg.content[0].text.value
  }
  if (!props.msg.assistant_id) {
    PostMessage('MessageContentAssistent props msg assistant_id is null')
    return <></>
  }
  const assistant = AssistantsStore((state) =>
    state.Assistants.get(props.msg.assistant_id as string)
  )
  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      sx={{ maxWidth: '80%' }}
    >
      <Stack direction="column" justifyContent="center" alignItems="center">
        <Avatar
          alt={assistant?.AssistantBase.Name}
          src={assistant?.AssistantBase.ImagePath}
          sx={{ width: '35px', height: '35px' }}
          // src={imgfile}
        />
        <MessageRunStep {...props}></MessageRunStep>
      </Stack>
      <Stack direction="column" justifyContent="flex-start" alignItems="flex-start">
        <Stack
          direction="row"
          justifyContent="space-between"
          width="100%"
          maxWidth="100%"
          minWidth="240px"
          alignItems="flex-end"
          paddingRight="5px"
        >
          <Typography level="body-sm" fontSize="12px" ml={'5px'}>
            {assistant?.AssistantBase.Name}
          </Typography>
          <Typography level="body-sm" fontSize="12px" mr="12px">
            {moment(props.msg.created_at * 1000).format('MM/DD A hh:mm')}
          </Typography>
        </Stack>
        <Chip
          color="neutral"
          variant="soft"
          sx={{
            borderTopRightRadius: 'lg',
            borderTopLeftRadius: 0
          }}
        >
          <Box m="3px" p="3px" fontSize={'16px'} fontWeight="400">
            {(props.msg.metadata as object)['MessageState'] === 'WaitRun' ? (
              // <Typography sx={{ whiteSpace: 'normal' }}>
              <AnimationText text={outvalue} stop={false} loop={true}></AnimationText>
            ) : (
              // </Typography>
              <Box
                sx={{ whiteSpace: 'break-spaces', borderCollapse: 'collapse', borderColor: 'red' }}
              >
                <MarkDown marktext={outvalue} message={props.msg} />
              </Box>
            )}
          </Box>
        </Chip>
        {props.msg.content.map((value, index) => {
          return (
            <Stack direction="column" key={index}>
              <Typography color="danger">
                <Typography color="danger">{`type:${value.type} `}</Typography>
                {value.type == 'text'
                  ? value.text.value.substring(0, 5) + '...'
                  : value.image_file.file_id}
              </Typography>

              <Typography ml="10px" color="danger">
                {value.type == 'text'
                  ? value.text.annotations.map((item, index) => {
                      if (item.type == 'file_path') {
                        return (
                          <Typography
                            key={index}
                          >{`ID:${item.file_path.file_id} Text:${item.text}`}</Typography>
                        )
                      } else if (item.type == 'file_citation') {
                        return (
                          <Typography key={index}>
                            {`ID:${item.file_citation.file_id} Text:${item.text} quote:${item.file_citation.quote}`}
                          </Typography>
                        )
                      } else {
                        return <></>
                      }
                    })
                  : ''}
              </Typography>
            </Stack>
          )
        })}
      </Stack>
    </Stack>
  )
}
