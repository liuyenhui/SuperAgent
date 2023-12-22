import { Card, CardContent, Link, Sheet, Typography } from '@mui/joy'
import Stack from '@mui/joy/Stack'
import { RIGHT_HEAD_HEIGHT } from '@renderer/components/public/constants'
export default function ChatHead(): JSX.Element {
  return (
    <Sheet variant="soft" sx={{ width: '100%', height: RIGHT_HEAD_HEIGHT }}>
      <Stack
        direction="row"
        alignItems="stretch"
        justifyContent="flex-start"
        sx={{
          // position:"fixed",
          width: 1,
          height: '60px'
          // backgroundColor:"darkgreen"
        }}
      >
        <Card
          variant="outlined"
          orientation="horizontal"
          sx={{
            width: 320,
            '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' }
          }}
        >
          <CardContent>
            <Typography level="title-lg" id="card-description">
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
        </Card>
      </Stack>
    </Sheet>
  )
}
