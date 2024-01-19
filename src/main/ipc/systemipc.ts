/**
 * 系统级IPC通信,包含文件操作,系统命令调用,Python代码执行,shell命令
 */

import { ipcMain, dialog, shell } from 'electron'
import log from 'electron-log'
import path from 'node:path'

ipcMain.handle('invoke_open_files', async (_event, arge) => {
  log.info(`recv invoke_open_files ${arge}`)
  const dialogConfig = {
    title: 'Select a file',
    buttonLabel: 'select',
    properties: ['openFile'] as never
  }
  try {
    const result = await dialog.showOpenDialog(null as never, dialogConfig)
    if (result.canceled) {
      return Promise.resolve([])
    }
    const files = new Map<string, System.FileType>()
    result.filePaths.map((filepath): void => {
      const file: System.FileType = {
        FilePath: filepath,
        FileName: path.basename(filepath),
        FilextName: path.extname(filepath)
      }
      files.set(filepath, file)
    })
    return Promise.resolve(new Map(files))
  } catch (error) {
    return Promise.reject(error)
  }
})
// 打开文件
ipcMain.handle('invoke_show_file', async (_event, arge) => {
  const { filepath } = arge
  shell.openPath(filepath)
})
