// import { resolve } from 'path'
import path from 'path-browserify'

// externalizeDepsPlugin:自动依赖外部 bytecodePlugin:源码包含v8字节码
// 文档 https://cn.electron-vite.org/guide/build
import { defineConfig, bytecodePlugin, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import commonjs from '@rollup/plugin-commonjs' //引入commojs
// import emotion from '@emotion/babel-plugin'

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
        '@renderer': path.resolve('src/renderer/src'),
        '@components': path.resolve('src/components'),
        '@resources': path.resolve('resources')
      }
    },
    // 此处解决emotion?
    optimizeDeps: {
      include: ['@mui/material/Tooltip']
    },
    plugins: [
      commonjs(),
      react({
        //   jsxRuntime: 'classic'
        jsxRuntime: 'automatic',
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin']
        }
      })
    ]
  }
})
