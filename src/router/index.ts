import type { App } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoutes } from './base'
import { createPermissionGuard } from './guard/permissionGuard'
import { whiteNameList } from './constant'

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior() {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    }
  },
})

// reset router
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !whiteNameList.some((n) => n === name)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export async function setupRouter(app: App) {
  // 创建路由守卫
  createPermissionGuard(router, whiteNameList)

  app.use(router)

  // 路由准备就绪后挂载APP实例
  await router.isReady()
}

export default router
