import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: null
  }
}

// window.api = (): string => {
//   return 'Cheng Du'
// }
