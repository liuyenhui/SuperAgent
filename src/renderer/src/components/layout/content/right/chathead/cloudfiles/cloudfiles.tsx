import { IconButton, LinearProgress, List, Stack, Tooltip, Typography } from '@mui/joy'
import { SvgIcons, SvgPathMap } from '@renderer/components/public/SvgIcons'
import { CloudDialog } from '../../../../../public/clouddialog'
import { useEffect, useState } from 'react'
import { FileStore } from '@renderer/components/public/filestore'
import { LEFT_WIDTH } from '@renderer/components/public/constants'
import { UpdateAssistantFileIds } from '@renderer/components/public/assistantstore'
// 关联文件列表
function BoxFiles(props: { assistant: System.Assistant; uploadingids: boolean }): JSX.Element {
  const { assistant, uploadingids } = props
  const files = FileStore().Files
  return (
    <Stack direction="column" height="100%">
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
        {/* <ListDivider inset="gutter" /> */}
        {assistant.AssistantBase.Fileids?.map((id) => {
          const file = files.find((file) => {
            return file.id == id
          })
          return file ? (
            <Tooltip
              key={file.id}
              color="primary"
              placement="bottom"
              variant="plain"
              title={<Typography>{file.filename}</Typography>}
            >
              <Stack direction="column" maxWidth="35px">
                <SvgIcons fontSize="small" d={SvgPathMap.Note}></SvgIcons>
                <Typography noWrap sx={{ fontSize: '10px' }}>
                  {file.filename}
                </Typography>
              </Stack>
            </Tooltip>
          ) : (
            <div key={id}></div>
          )
        })}
      </List>
      <LinearProgress
        thickness={1}
        variant="plain"
        sx={{
          display: uploadingids ? 'flex' : 'none',
          width: '100%'
        }}
      />
    </Stack>
  )
}

export function CludeFiles(props: { assistant: System.Assistant }): JSX.Element {
  const { assistant } = props
  const [open, setOpen] = useState(false)
  const [uploadingids, setUploadingids] = useState(false)
  const [filedisabled, setFileDisabled] = useState(true)
  useEffect(() => {
    // 文件加载完成
    window.electron.ipcRenderer.on('post_file_load_finsh', () => {
      setFileDisabled(false)
    })
  }, [])
  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      width="100%"
      height="100%"
      marginLeft="3px"
    >
      <IconButton
        variant="plain"
        size="sm"
        disabled={filedisabled}
        onClick={() => {
          setOpen(true)
        }}
      >
        <SvgIcons color={filedisabled ? 'disabled' : 'success'} d={SvgPathMap.CloudDone}></SvgIcons>
      </IconButton>
      {/* <Sheet sx={{ mr: '15px' }}></Sheet> */}
      <BoxFiles assistant={assistant} key="1" uploadingids={uploadingids}></BoxFiles>
      <CloudDialog
        open={open}
        setOpen={setOpen}
        fileids={assistant.AssistantBase.Fileids}
        okcallback={(ids) => {
          setUploadingids(true)
          UpdateAssistantFileIds(assistant.AssistantBase.AssistantID, ids).then((ids) => {
            console.log(ids)
            setUploadingids(false)
          })
        }}
      ></CloudDialog>
    </Stack>
  )
}
