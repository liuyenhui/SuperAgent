import {
  Button,
  CircularProgress,
  DialogContent,
  DialogTitle,
  IconButton,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Table,
  Typography
} from '@mui/joy'
import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'
import { UpdateAssistantRemoveFile } from '@renderer/components/public/assistantstore'
import { AppendFile, FileStore, RemoveFile } from '@renderer/components/public/filestore'
import moment from 'moment-timezone'
import { useEffect, useState } from 'react'

export function CloudDialog(props: {
  open: boolean
  setOpen: (open: boolean) => void
  fileids: Array<string>
  okcallback: (ids: Array<string>) => void
}): JSX.Element {
  const { open, setOpen, okcallback } = props
  const [fileids, setFileids] = useState([...props.fileids])
  const [deleteing, setDeleteing] = useState(false)
  const [uploading, setUploading] = useState(false)
  useEffect(() => {
    if (open) {
      setFileids([...props.fileids])
    }
  }, [open])
  useEffect(() => {
    // 注册上传进度函数
    window.electron.ipcRenderer.on('post_upload_file_start', (_event, args) => {
      console.log(args)
    })
    window.electron.ipcRenderer.on('post_upload_file_process', (_event, args) => {
      console.log(args)
    })
    window.electron.ipcRenderer.on('post_upload_file_finish', (_event, args) => {
      console.log(args)
    })
    window.electron.ipcRenderer.on('upload_file_finsh', (_event, arge) => {
      const { fileobject } = arge
      AppendFile(fileobject)
    })
  }, [])
  const files = FileStore().Files
  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" minWidth="700px">
          <ModalClose />
          <Typography level="title-md">Select filse attached to the assistant</Typography>
          <Table
            variant="plain"
            borderAxis="none"
            hoverRow={true}
            sx={{
              borderWidth: '0px',
              display: 'table-column',
              backgroundColor: 'initial',
              textAlign: 'left',
              maxHeight: '500px',
              overflowY: 'auto'
            }}
          >
            <thead>
              <tr>
                <th style={{ maxWidth: '30px' }}>Add</th>
                <th style={{ maxWidth: '100%' }}>File name</th>
                <th>Size</th>
                <th>Create at</th>
                <th style={{ width: '15px' }}> </th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => {
                // 设置临时属性
                return (
                  <tr
                    key={file.id}
                    onClick={() => {
                      // 未选选中
                      if (fileids.indexOf(file.id) < 0) {
                        setFileids([...fileids, file.id])
                      } else {
                        // 已选中
                        const fids = fileids.filter((id) => {
                          return id != file.id
                        })
                        setFileids(fids)
                      }
                    }}
                  >
                    <td>
                      {fileids.indexOf(file.id) < 0 ? (
                        <></>
                      ) : (
                        <SvgIcons sx={{ fontSize: '14px' }} d={SvgPathMap.Check}></SvgIcons>
                      )}
                    </td>
                    <td style={{ maxWidth: '350px' }}>
                      <Typography noWrap level="body-sm">
                        {file.filename}
                      </Typography>
                    </td>
                    <td>{(file.bytes / 1000).toFixed(1)}k</td>
                    <td>{moment(file.created_at * 1000).format('YY/MM/DD HH:mm:ss')}</td>
                    <td style={{ margin: '0', padding: '0' }}>
                      <IconButton
                        onClick={() => {
                          setDeleteing(true)
                          window.electron.ipcRenderer
                            .invoke('invoke_remove_file', {
                              file_id: file.id
                            })
                            .then((file_id) => {
                              RemoveFile(file_id)
                              return UpdateAssistantRemoveFile(file_id)
                            })
                            .finally(() => {
                              setDeleteing(false)
                            })
                          console.log('delete file' + file.filename)
                        }}
                        size="sm"
                        color="success"
                      >
                        <SvgIcons d={SvgPathMap.Delete}></SvgIcons>
                      </IconButton>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Button
              variant="soft"
              onClick={() => {
                window.electron.ipcRenderer
                  .invoke('invoke_open_files', 'jpg')
                  .then((result: Map<string, System.FileType>) => {
                    // 选择文件数量大于0
                    if (result.size > 0) {
                      setUploading(true)
                      const filepaths = Array.from(result.values()).map((item) => {
                        return item.FilePath
                      })
                      window.electron.ipcRenderer
                        .invoke('invoke_upload_file', {
                          filepaths: filepaths
                        })
                        .then(() => {
                          setUploading(false)
                        })
                      // console.log(result)
                    }
                  })
                  .catch((error) => {
                    alert(error)
                  })
              }}
            >
              Upload file
            </Button>
            <Button
              variant="soft"
              onClick={() => {
                setOpen(false)
                okcallback(fileids)
              }}
            >
              Ok
            </Button>
          </Stack>
        </ModalDialog>
      </Modal>
      <Modal open={deleteing}>
        <ModalDialog layout="center">
          <DialogTitle>Remove File</DialogTitle>
          <DialogContent>
            <Typography startDecorator={<CircularProgress size="sm" />}>
              Remove file wait...
            </Typography>
          </DialogContent>
        </ModalDialog>
      </Modal>
      <Modal open={uploading}>
        <ModalDialog layout="center">
          <DialogTitle>Upload File</DialogTitle>
          <DialogContent>
            <Typography startDecorator={<CircularProgress size="sm" />}>
              Upload file wait...
            </Typography>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  )
}
