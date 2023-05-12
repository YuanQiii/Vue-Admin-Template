import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'
import { setupRouter } from './router'
import { setupStore } from '@/store'
import 'virtual:svg-icons-register'

const app = createApp(App)

async function setupApp() {
  // 挂载vuex状态管理
  setupStore(app)

  // 挂载路由
  await setupRouter(app)

  app.mount('#app')
}

setupApp()
