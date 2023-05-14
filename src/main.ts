import { createApp } from 'vue'
import App from './App.vue'

import { setupRouter } from './router'
import { setupStore } from '@/store'

import 'virtual:uno.css'
import 'virtual:svg-icons-register'
import 'ant-design-vue/dist/antd.variable.min.css'
import '@/styles/index.less'

const app = createApp(App)

async function setupApp() {
  // 挂载vuex状态管理
  setupStore(app)

  // 挂载路由
  await setupRouter(app)

  app.mount('#app')
}

setupApp()
