import { resolve } from 'path'
// externalizeDepsPlugin:自动依赖外部 bytecodePlugin:源码包含v8字节码
// 文档 https://cn.electron-vite.org/guide/build
import { defineConfig, bytecodePlugin, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  }
})
