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
import { CloudDialog } from '@renderer/components/public/clouddialog'
import { LEFT_WIDTH } from '@renderer/components/public/constants'
import { FileObject, FileStore } from '@renderer/components/public/filestore'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
function FileList(props: { files: Array<FileObject> }): JSX.Element {
  const { files } = props
  return (
    <List
      orientation="horizontal"
      variant="plain"
      size="sm"
      // width 计算应动态 获取470px next version update
      sx={{
        pt: '5px',
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

      {files.map((file) => {
        return (
          <Tooltip
            key={file.id}
            title={<TooltipTitle file={file} />}
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
                  {file.filename}
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
function TooltipTitle(props: { file: FileObject }): JSX.Element {
  const { file } = props
  return (
    <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
      <Typography noWrap level="body-sm" variant="plain">
        <span>{file.filename}</span>
      </Typography>
      <Chip
        onClick={() => {
          // window.electron.ipcRenderer.invoke('invoke_show_file', { filepath: file.FilePath })
        }}
      >
        Open
      </Chip>
      <Chip
        onClick={() => {
          // removefile(file.FilePath)
        }}
      >
        Remove
      </Chip>
    </Stack>
  )
}

export function MessageSendFile(props: {
  thread_id: string
  assistant_id: string | undefined
  messagefiles: Array<FileObject>
  setMessagefiles: (filse: Array<FileObject>) => void
}): JSX.Element {
  const { t } = useTranslation()
  const { thread_id, assistant_id, messagefiles, setMessagefiles } = props

  const [open, setOpen] = useState(false)
  const files = FileStore().Files

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
          setOpen(true)
        }}
      >
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
          <SvgIcons d={SvgPathMap.Upload} sx={{ mr: '1px' }} />
          <Typography level="body-sm" variant="plain" color="primary">
            {t('chat.sendfiles')}
          </Typography>
        </Stack>
      </Chip>
      <FileList
        files={messagefiles.filter((file) => {
          return (
            files.findIndex((item) => {
              return item.id == file.id
            }) >= 0
          )
        })}
      ></FileList>
      <CloudDialog
        open={open}
        setOpen={setOpen}
        fileids={messagefiles.map((file) => file.id)}
        okcallback={(ids) => {
          const selectfiles = files.filter((file) => {
            return ids.indexOf(file.id) >= 0
          })
          setMessagefiles(selectfiles)
        }}
      ></CloudDialog>
    </Stack>
  )
}
