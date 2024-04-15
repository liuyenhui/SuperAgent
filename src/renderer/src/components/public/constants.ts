export const FOOTER_BAR_HEIGHT = 35
export const LEFT_HEAD_HEIGHT = 65
export const LEFT_WIDTH = 200
export const LEFT_CONTENT_HEIGHT = `calc(100vh - ${FOOTER_BAR_HEIGHT}px - ${LEFT_HEAD_HEIGHT}px - 10px)`
export const RIGHT_HEAD_HEIGHT = LEFT_HEAD_HEIGHT
export const RIGHT_INPUT_HEIGHT = 120
// 右侧对话窗口高度
export const RIGHT_CHAT_HEIGHT = `calc(100vh - ${FOOTER_BAR_HEIGHT}px - 8px)`
// 右侧对话窗口宽度
export const RIGHT_CHAT_WIDTH = `calc(100vw - ${LEFT_WIDTH}px - 8px)`
// 右侧消息窗口高度
export const RIGHT_LIST_HEIGHT = `calc(${RIGHT_CHAT_HEIGHT} - ${RIGHT_HEAD_HEIGHT}px - ${RIGHT_INPUT_HEIGHT}px)`
// 右侧消息窗口下定位
export const RIGHT_LIST_BOTTOM = RIGHT_INPUT_HEIGHT
