/**
 * 渲染进程IPC
 *  1. 负责渲染webview
 *  2. 负责用户AI操作转发到主进程
 *  3. 负责全局Store操作
 */

const ipcRenderer = window.electron.ipcRenderer
// 返回消息 暂时未使用,主进程主动发消息
ipcRenderer.on('respone_assistants', (event, callback) => {
  console.log(`event:${event.senderId.toString()}\nmessage:${callback}`)
})
