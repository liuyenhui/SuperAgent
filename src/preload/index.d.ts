import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: () => string
  }
}

// window.api = (): string => {
//   return 'Cheng Du'
// }
