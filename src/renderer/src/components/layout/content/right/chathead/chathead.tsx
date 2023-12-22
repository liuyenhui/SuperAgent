import { ButtonGroup, Card, CardContent, Grid, Link, Sheet, Typography } from '@mui/joy'
import { RIGHT_HEAD_HEIGHT } from '@renderer/components/public/constants'
import { SvgPathMap, SvgIcons } from '@renderer/components/public/SvgIcons'
import { SystemStore } from '@renderer/components/public/systemstore'
import { ReactPropTypes } from 'react'
function PopListView(props: ReactPropTypes): JSX.Element {
  const lefthidden = SystemStore((state) => state.LeftHidden)
  const updatelefthidden = SystemStore((state) => state.updateLeftHidden)
  const onClick = (event: unknown): void => {
    console.log(props.bool)
    console.log(event)
    updatelefthidden()
  }
  return (
    <Sheet
      variant="soft"
      sx={{
        m: 0,
        p: 0,
        height: '100%',
        width: '15px'
      }}
    >
      <ButtonGroup onClick={onClick} sx={{ height: '100%', alignItems: 'center', p: 0 }}>
        <SvgIcons
          sx={{ width: '15px', p: 0, fontSize: '18px' }}
          d={lefthidden ? SvgPathMap.ChevronRight : SvgPathMap.ChevronLeft}
        ></SvgIcons>
      </ButtonGroup>
    </Sheet>
  )
}

export default function ChatHead(props: ReactPropTypes): JSX.Element {
  return (
    <Sheet
      variant="soft"
      sx={{
        display: 'flex',
        borderBottom: '1px solid',
        borderColor: 'divider',
        width: '100%',
        height: RIGHT_HEAD_HEIGHT
      }}
    >
      <PopListView {...props}></PopListView>
      <Card
        variant="plain"
        orientation="horizontal"
        sx={{
          borderRadius: 0,
          p: 0,
          m: 0,
          width: '100%',
          height: 1,
          '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' }
        }}
      >
        <Grid
          container
          spacing={2}
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ flexGrow: 1, m: 0, p: 0 }}
        >
          <CardContent>
            <Typography level="title-sm" id="card-description">
              Yosemite Park
            </Typography>
            <Typography level="body-sm" aria-describedby="card-description" mb={1}>
              <Link
                overlay
                underline="none"
                href="#interactive-card"
                sx={{ color: 'text.tertiary' }}
              >
                California, USA
              </Link>
            </Typography>
          </CardContent>
        </Grid>
      </Card>
    </Sheet>
  )
}
