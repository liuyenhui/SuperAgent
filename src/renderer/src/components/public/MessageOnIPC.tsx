/**
 * 负责渲染进程IPC通信响应
 */
import { useEffect, useState } from 'react'
import log from 'electron-log/renderer'
import { Snackbar, Button, Typography } from '@mui/joy'
import { SvgIcons, SvgPathMap } from './SvgIcons'
import { SetMessageSteps } from './messagestore'
// type DownFileState = 'None' | 'DownLoad' | 'Finish'
type DownFileState = {
  file_name: string
  file_path: string
  file_size: number
  state: 'None' | 'DownLoad' | 'Finish'
}
export function MessageOnIPC(): JSX.Element {
  // const [open, setOpen] = useState(true)
  const [state, setState] = useState<DownFileState>({
    file_name: '',
    file_size: 0,
    file_path: '',
    state: 'None'
  })
  useEffect(() => {
    // 文件下载检索完成
    window.electron.ipcRenderer.on('post_filedownload_retrieve_result', (_event, message) => {
      const { file_id, file_path, file_name, file_size } = message

      setState({
        file_name: file_name,
        file_size: file_size,
        file_path: file_path,
        state: 'DownLoad'
      })
      log.info(
        `recv post_filedownload_retrieve_result ${file_id} ${file_path} ${file_name} ${file_size}`
      )
    })
    window.electron.ipcRenderer.on('post_filedownload_finish', (_event, message) => {
      const { file_id, file_path, file_name, file_size } = message
      setState({
        file_name: file_name,
        file_size: file_size,
        file_path: file_path,
        state: 'Finish'
      })

      log.info(`recv post_filedownload_finish ${file_id} ${file_path} ${file_name} ${file_size}`)
    })
    window.electron.ipcRenderer.on('post_message_steps', (_event, message) => {
      const { thread_id, run_id, msg_id, steps } = message
      SetMessageSteps(thread_id, run_id, steps)
      console.log(thread_id, run_id, msg_id, steps)
    })
  }, [])
  return (
    <Snackbar
      variant="soft"
      color="success"
      open={state.state == 'DownLoad' || state.state == 'Finish'}
      onClose={() => setState({ file_name: '', file_path: '', file_size: 0, state: 'None' })}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      // startDecorator={<PlaylistAddCheckCircleRoundedIcon />}
      endDecorator={
        <Button
          onClick={() => setState({ file_name: '', file_path: '', file_size: 0, state: 'None' })}
          size="sm"
          variant="soft"
          color="success"
        >
          close
        </Button>
      }
    >
      <SvgIcons
        d={state.state == 'DownLoad' ? SvgPathMap.FileDownload : SvgPathMap.Check}
      ></SvgIcons>
      <Typography level="body-md">{`Download file ${state.file_name}`}</Typography>
    </Snackbar>
  )
}
