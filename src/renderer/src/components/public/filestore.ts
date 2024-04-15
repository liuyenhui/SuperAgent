/**
 * 定义消息存储
 */
import { create } from 'zustand'

export interface FileObject {
  id: string
  bytes: number
  created_at: number

  filename: string
  object: 'file'
  purpose: 'fine-tune' | 'fine-tune-results' | 'assistants' | 'assistants_output'
  status: 'uploaded' | 'processed' | 'error'
  status_details?: string
}
type FilesData = {
  Files: Array<FileObject>
}
// const Files: FilesData = {
//   Files: new Array<FileObject>()
// }

export const FileStore = create<FilesData>()(() => ({ Files: new Array<FileObject>() }))

export const FileLoad = (): void => {
  window.electron.ipcRenderer
    .invoke('invoke_file_load', 'file')
    .then((files) => {
      FileStore.setState((state) => {
        return { ...state, Files: files }
      })
    })
    .catch((error) => alert(error))
  return
}
export const RemoveFile = (file_id: string): void => {
  FileStore.setState((store) => {
    return {
      ...store,
      Files: [
        ...store.Files.filter((file) => {
          return file.id != file_id
        })
      ]
    }
  })
}
export const AppendFile = (fileobject: FileObject): void => {
  if (
    FileStore.getState().Files.findIndex((file) => {
      return file.id == fileobject.id
    }) >= 0
  ) {
    return
  }
  FileStore.setState((store) => {
    return {
      ...store,
      Files: [...store.Files, fileobject]
    }
  })
}
