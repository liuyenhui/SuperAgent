import { useEffect } from 'react'
import log from 'electron-log/renderer'

export function MessageOnIPC(): JSX.Element {
  useEffect(() => {
    // 文件下载检索完成
    window.electron.ipcRenderer.on('post_filedownload_retrieve_result', (_event, message) => {
      const { file_id, file_path, file_name, file_size } = message
      log.info(
        `recv post_filedownload_retrieve_result ${file_id} ${file_path} ${file_name} ${file_size}`
      )
    })
    window.electron.ipcRenderer.on('post_filedownload_finish', (_event, message) => {
      const { file_id, file_path, file_name, file_size } = message
      log.info(`recv post_filedownload_finish ${file_id} ${file_path} ${file_name} ${file_size}`)
    })
  }, [])
  return <></>
}
