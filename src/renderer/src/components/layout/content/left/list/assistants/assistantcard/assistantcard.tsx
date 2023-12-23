import { Card, Typography, Avatar, Grid, Sheet, Link, ButtonGroup, Box } from '@mui/joy'
import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'
import { AssistantDialog } from '../assistantdialog'
import { useState } from 'react'
import log from 'electron-log'
import { SystemStore } from '@renderer/components/public/systemstore'
import { AssistantsStore } from '@renderer/components/public/assistantstore'
// 测试使用,发布删除
// import imgfile from '@resources/assistants/chat.png'

interface AssistantProp {
  children: JSX.Element | null
  assistantid: string
}

export function AssistantCard(props: AssistantProp): JSX.Element {
  const [open, setOpen] = useState(false)
  const { assistantid } = props
  // 通过assistantid助手信息
  const assistant = AssistantsStore.getState().Assistants.get(assistantid) as System.Assistant
  // 更新当前使用的助手ID的函数
  const updateAssistantID = SystemStore((state) => state.updateAssistantID)
  // 获取正在使用的助手ID
  const selectassistantid = SystemStore((state) => state.AssistantID)

  log.info(assistant.AssistantBase.ImagePath)

  // 首次加载 使用getState 不回触发状态能行回调
  // let AssistantID = SystemStore.getState().AssistantID
  // let AssistantID = SystemStore((state) => state.AssistantID)
  // useEffect(() => {
  //   if (AssistantID === '') {
  //     AssistantID = props.assistant.AssistantBase.AssistantID as string
  //     // updateAssistantID(props.assistant.AssistantBase.AssistantID as string)
  //   }
  // }, [])

  // AssistantID = SystemStore((state) => state.AssistantID)

  const onClick = (event: unknown): void => {
    // setColor('primary')
    updateAssistantID(assistantid)
    console.log(event)
  }
  // log.info(`AssistantID:${AssistantID}`)
  // 对话 Excel表 教师助手
  return (
    <Sheet>
      <Card
        variant="soft"
        orientation="horizontal"
        color={assistantid === selectassistantid ? 'primary' : 'neutral'}
        //color as ColorPaletteProp}
        sx={{
          // content: '',
          // position: 'absolute',
          width: 140,
          height: 40,
          mt: '10px',
          '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' }
        }}
      >
        <ButtonGroup
          onClick={onClick}
          // onClick={(event) => {
          // }}
        >
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ flexGrow: 1 }}
          >
            <Grid
              xs={3}
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              sx={{ p: 0 }}
            >
              <Avatar
                alt={assistant.AssistantBase.Name as string}
                src={assistant.AssistantBase.ImagePath as string}
                // src={imgfile}
              />
            </Grid>

            <Grid xs={7}>
              <Typography level="title-lg" id="card-description">
                <Link
                  overlay
                  underline="none"
                  href="#interactive-card"
                  sx={{ color: 'text.primary' }}
                >
                  {assistant.AssistantBase.Name}
                </Link>
              </Typography>
            </Grid>
            <Grid xs={2} sx={{}}>
              <Box>
                <SvgIcons d={SvgPathMap.Info} />
              </Box>
            </Grid>
          </Grid>
        </ButtonGroup>
      </Card>
      <AssistantDialog
        assistent={assistant}
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      />
    </Sheet>
  )
}
