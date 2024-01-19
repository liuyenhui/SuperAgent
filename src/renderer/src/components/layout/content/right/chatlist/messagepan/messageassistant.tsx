import { Avatar, Box, Chip, Stack, Typography } from '@mui/joy'
import { AnimationText } from '@renderer/components/public/AnimationText'
import { AssistantsStore } from '@renderer/components/public/assistantstore'
import { PostMessage } from '@renderer/components/public/systemstore'

import { MarkDown } from './markdownplus'
import moment from 'moment-timezone'
moment.tz.setDefault()

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
      <Avatar
        alt={assistant?.AssistantBase.Name}
        src={assistant?.AssistantBase.ImagePath}
        sx={{ width: '25px', height: '25px' }}
        // src={imgfile}
      />
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
                <MarkDown marktext={outvalue} />
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
