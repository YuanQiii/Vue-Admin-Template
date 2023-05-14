import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import viteCompression from 'vite-plugin-compression'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import { visualizer } from 'rollup-plugin-visualizer'
import browserslist from 'browserslist'
import legacy from '@vitejs/plugin-legacy'
import viteCDNPlugin from 'vite-plugin-cdn-import'
import { resolve } from 'node:path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const CWD = process.cwd()

const browserslistConfig = browserslist.loadConfig({ path: '.' })

const mockEnable: boolean = (process.env.USE_MOCK as unknown as boolean) || false

// https://vitejs.dev/config/
export default defineConfig({
  base: './', //打包路径
  plugins: [
    vue(),
    // gzip压缩 生产环境生成 .gz 文件
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCDNPlugin({
      // 需要 CDN 加速的模块
      modules: [
        {
          name: 'axios',
          var: 'axios',
          path: 'https://cdn.jsdelivr.net/npm/axios@1.4.0/dist/axios.min.js',
        },
      ],
    }),
    createSvgIconsPlugin({
      // Specify the icon folder to be cached
      iconDirs: [resolve(CWD, 'src/assets/icons')],
      // Specify symbolId format
      symbolId: 'svg-icon-[dir]-[name]',
    }),
    UnoCSS(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          // 不加载css, 而是手动加载css. 通过手动加载less文件并将less变量绑定到css变量上, 即可实现动态主题色
          importStyle: false,
        }),
      ],
    }),
    viteMockServe({
      mockPath: 'mock',
      localEnabled: true,
      prodEnabled: !true,
      // 这样可以控制关闭mock的时候不让mock打包到最终代码内
      injectCode: `
        import { setupProdMockServer } from '../mock/index';
        setupProdMockServer();
      `,
    }),
    VueSetupExtend(),
    visualizer(),
    legacy({
      targets: browserslistConfig, // 需要兼容的目标列表，可以设置多个
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'], // 面向IE11时需要此插件
    }),
  ],
  // 配置别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // 配置全局 less 样式文件
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import '@/styles/variables.less';`,
        javascriptEnabled: true,
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5173',
        changeOrigin: true, // 是否允许不同源
        secure: false, // 支持https
        rewrite: (path) => path.replace(/^\/api/, '/mock'),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // 将 node_modules 中的代码单独打包成一个 JS 文件
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  },
})
