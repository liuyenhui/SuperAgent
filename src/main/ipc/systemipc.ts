/**
 * 系统级IPC通信,包含文件操作,系统命令调用,Python代码执行,shell命令
 * Supported formats: "c", "cpp", "css", "csv", "docx", "gif", "html", "java", "jpeg", "jpg", "js", "json", "md", "pdf", "php", "png", "pptx", "py", "rb", "tar", "tex", "ts", "txt", "xlsx", "xml", "zip"'
 */

import { ipcMain, dialog, shell } from 'electron'
import log from 'electron-log'
import path from 'node:path'
import fs from 'node:fs'

import OpenAI from 'openai'
import { OpenAIParam, MainIPC } from './assistantipc'

const filters = [
  {
    name: 'Docment',
    extensions: [
      'c',
      'cpp',
      'css',
      'csv',
      'docx',
      'gif',
      'html',
      'java',
      'jpeg',
      'jpg',
      'js',
      'json',
      'md',
      'pdf',
      'php',
      'png',
      'pptx',
      'py',
      'rb',
      'tar',
      'tex',
      'ts',
      'txt',
      'xlsx',
      'xml',
      'zip'
    ]
  }
]
// 显示文件选择对话框
ipcMain.handle('invoke_open_files', async (_event, arge) => {
  log.info(`recv invoke_open_files ${arge}`)
  const dialogConfig = {
    title: 'Select a file',
    buttonLabel: 'select',
    properties: ['openFile'] as never,
    filters: filters
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
// upload files
ipcMain.handle('invoke_upload_file', async (_event, arge) => {
  const { filepaths } = arge
  try {
    const openai = new OpenAI(OpenAIParam)
    for (const filepath of filepaths) {
      // const stat = fs.statSync(filepath)
      const reader = fs.createReadStream(filepath)
      // reader.on('data', (buffer) => {
      //   log.info(`${filepath} ${buffer.length}/${stat.size}`)
      // })
      // 超时5分钟
      const fileobject = await openai.files.create(
        { file: reader, purpose: 'assistants' },
        { timeout: 300000 }
      )
      console.log(fileobject)
      // 通知上传文件完成
      MainIPC.mainWindow.webContents.send('upload_file_finsh', { fileobject: fileobject })
    }
    return Promise.resolve(filepaths)
  } catch (error) {
    return Promise.reject(error)
  }
})
// 列出全部文件
ipcMain.handle('invoke_file_load', async () => {
  try {
    const openai = new OpenAI(OpenAIParam)
    const files = await openai.files.list()
    // 通知加载文件完成
    MainIPC.mainWindow.webContents.send('post_file_load_finsh')
    return Promise.resolve(files.data)
  } catch (error) {
    return Promise.reject(error)
  }
})
// 删除云端文件
ipcMain.handle('invoke_remove_file', async (_event, arge) => {
  const { file_id } = arge
  try {
    const openai = new OpenAI(OpenAIParam)
    await openai.files.del(file_id)
    // MainIPC.mainWindow.webContents.send('remove_file_finsh', { file_id: file_id })
    return Promise.resolve(file_id)
  } catch (error) {
    alert(error)
    return Promise.reject(file_id)
  }
})
