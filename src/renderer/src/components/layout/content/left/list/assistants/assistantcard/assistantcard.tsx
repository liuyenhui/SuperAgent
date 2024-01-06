import { Card, Typography, Avatar, Grid, Sheet, Link, ButtonGroup, Box, Badge } from '@mui/joy'
import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'
import log from 'electron-log'
import { SystemInfoStore, UpdateSysinfo } from '@renderer/components/public/systemstore'
import { AssistantsStore } from '@renderer/components/public/assistantstore'
// 测试使用,发布删除
// import imgfile from '@resources/assistants/chat.png'

interface AssistantProp {
  children: JSX.Element | null
  assistantid: string
}

export function AssistantCard(props: AssistantProp): JSX.Element {
  // const [open, setOpen] = useState(false)
  const { assistantid } = props
  // 通过assistantid助手信息
  // const assistant = AssistantsStore.getState().Assistants.get(assistantid) as System.Assistant
  const assistants = AssistantsStore((state) => state.Assistants)
  const assistant = assistants.get(assistantid)

  // 更新当前使用的助手ID的函数
  // 获取正在使用的助手ID
  const selectassistantid = SystemInfoStore((state) => state.AssistantID)
  log.info(assistant?.AssistantBase.ImagePath)

  const onClick = (event: unknown): void => {
    // setColor('primary')
    UpdateSysinfo('AssistantID', assistantid)
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
              <Badge
                badgeInset="18%"
                size="sm"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                color={assistant?.AssistantBase.Disabled ? 'warning' : 'success'}
              >
                <Avatar
                  alt={assistant?.AssistantBase.Name}
                  src={assistant?.AssistantBase.ImagePath}
                  // src={imgfile}
                />
              </Badge>
            </Grid>

            <Grid xs={7}>
              <Typography level="title-lg" id="card-description">
                <Link
                  overlay
                  underline="none"
                  href="#interactive-card"
                  sx={{ color: 'text.primary' }}
                >
                  {assistant?.AssistantBase.Name}
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
      {/* <AssistantDialog
        assistent={assistant}
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      /> */}
    </Sheet>
  )
}
