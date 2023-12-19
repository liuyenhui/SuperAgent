import { Card, Typography } from '@mui/joy'
interface AssistantProp {
  Name: string
}

export function AssistantCard(props: AssistantProp): JSX.Element {
  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      sx={{
        width: 140,
        height: 40,
        mt: '10px',
        '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' }
      }}
    >
      <Typography fontSize="h4">{props.Name}</Typography>
    </Card>
  )
}
