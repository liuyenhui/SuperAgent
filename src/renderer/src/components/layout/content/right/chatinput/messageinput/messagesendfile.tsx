import {
  Chip,
  List,
  ListDivider,
  ListItem,
  ListItemDecorator,
  Sheet,
  Stack,
  Tooltip,
  Typography
} from '@mui/joy'
import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'
import { LEFT_WIDTH } from '@renderer/components/public/constants'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
function InstFiles<T>(items: Map<string, T>, additems: Map<string, T>): Map<string, T> {
  const result = new Map<string, T>(items)
  additems.forEach((value, key) => {
    result.set(key, value)
  })
  return result
}
export function MessageSendFile(props: {
  thread_id: string
  assistant_id: string | undefined
}): JSX.Element {
  const { t } = useTranslation()
  const { thread_id, assistant_id } = props
  const [files, setFiles] = useState<Map<string, System.FileType>>(new Map())

  console.log(thread_id, assistant_id)
  return (
    <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
      <Chip
        variant="plain"
        color="primary"
        size="sm"
        sx={{
          height: 'auto',
          mt: '5px',
          mb: '5px',
          ml: 'auto'
        }}
        onClick={() => {
          window.electron.ipcRenderer
            .invoke('invoke_open_files', 'jpg')
            .then((result: Map<string, System.FileType>) => {
              if (result.size > 0) {
                const newfiles = InstFiles(files, result)
                setFiles(newfiles)
              }
            })
            .catch((error) => {
              alert(error)
            })
          // 提交
        }}
      >
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
          <SvgIcons d={SvgPathMap.Upload} sx={{ mr: '1px' }} />
          <Typography level="body-sm" variant="plain" color="primary">
            {t('chat.sendfiles')}
          </Typography>
        </Stack>
      </Chip>
      <FileList files={files} setFiles={setFiles}></FileList>
    </Stack>
  )
}

function FileList(props: {
  files: Map<string, System.FileType>
  setFiles: (files: Map<string, System.FileType>) => void
}): JSX.Element {
  const { files, setFiles } = props
  return (
    <List
      orientation="horizontal"
      variant="plain"
      size="sm"
      // width 计算应动态 获取470px next version update
      sx={{
        pt:'5px',
        width: `calc(100vw - ${LEFT_WIDTH}px - 270px)`,
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: '3px'
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(14, 13, 13, 0.8)',
          borderRadius: '3px'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgb(48, 45, 45)',
          borderRadius: '5px'
        }
      }}
    >
      <ListDivider inset="gutter" />

      {Array.from(files.entries()).map((item) => {
        return (
          <Tooltip
            key={item[0]}
            title={
              <TooltipTitle
                file={item[1]}
                removefile={(filepath) => {
                  console.log(filepath)
                  files.delete(filepath)
                  setFiles(new Map(files))
                }}
              />
            }
            color="primary"
            placement="top"
            variant="plain"
          >
            <Sheet>
              <ListItem color="success">
                <ListItemDecorator>
                  <SvgIcons d={SvgPathMap.Image} sx={{ mr: '1px' }} />
                </ListItemDecorator>
                <Typography noWrap textOverflow="ellipsis" level="body-sm" variant="plain">
                  {item[1].FileName}
                </Typography>
              </ListItem>
              <ListDivider inset="gutter" />
            </Sheet>
          </Tooltip>
        )
      })}
    </List>
  )
}
function TooltipTitle(props: {
  file: System.FileType
  removefile: (filepath: string) => void
}): JSX.Element {
  const { file, removefile } = props
  return (
    <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
      <Typography noWrap level="body-sm" variant="plain">
        <span>{file.FilePath}</span>
      </Typography>
      <Chip
        onClick={() => {
          window.electron.ipcRenderer.invoke('invoke_show_file', { filepath: file.FilePath })
        }}
      >
        Open
      </Chip>
      <Chip
        onClick={() => {
          removefile(file.FilePath)
        }}
      >
        Remove
      </Chip>
    </Stack>
  )
}
