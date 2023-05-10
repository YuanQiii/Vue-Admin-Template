import outsideLayout from './outsideLayout'
import RouterView from '@/layout/routerView/index.vue'
import { isUrl } from '@/utils/is'
import { uniqueSlash } from '@/utils/urlUtils'
import router from '@/router'

import type { RouteRecordRaw } from 'vue-router'
import { constantRoutes, dashboardRoutes } from '@/router/base'

import { toHump } from '@/utils/common'

// 处理返回的 Route，生成路由结构
export function filterAsyncRoute(
  routes: API.UserMenu[],
  parentRoute: API.UserMenu | null = null,
  lastNamePath: string[] = []
): RouteRecordRaw[] {
  // 把需要动态路由的组件地址全部获取
  const modules = import.meta.glob('../views/**/*.vue', { eager: true })

  return routes
    .filter((item) => item.isShow && item.parentId === (parentRoute?.id || null))
    .map((item) => {
      const { router, viewPath, name, icon, orderNum, keepAlive, isShow, isExt, openMode } = item

      // 生成路由 path
      let realRoutePath = router

      if (parentRoute) {
        if (router.startsWith(parentRoute?.router)) {
          realRoutePath = router.split(parentRoute.router)[1]
        } else if (!isUrl(parentRoute.router) && !isUrl(router)) {
          realRoutePath = router
        }
      }
      realRoutePath = realRoutePath.startsWith('/') ? realRoutePath.slice(1) : realRoutePath
      realRoutePath = realRoutePath.replace(/http(s)?:\/\//, '')

      const namePath = lastNamePath.concat(toHump(router))

      // 路由结构
      const route: Partial<RouteRecordRaw> = {
        path: realRoutePath,
        name: toHump(router),
        meta: {
          orderNum,
          isExt,
          openMode,
          icon,
          title: name,
          type: item.type,
          namePath,
          keepAlive: keepAlive,
          isShow,
        },
      }

      // 目录
      if (item.type === 0) {
        const children = filterAsyncRoute(routes, item, namePath)
        if (children?.length) {
          route.component = RouterView
          route.children = children
          route.redirect = { name: children[0].name }
        }
      }
      // 菜单
      if (item.type === 1) {
        routes.filter((n) => n.parentId === item.id)
        route.component = () => Promise.resolve(modules[`../${viewPath}.vue`])
      }

      return route
    })
    .filter((item): item is RouteRecordRaw => !!item)
}

// 动态生成路由
export const generatorDynamicRouter = (asyncMenus: API.UserMenu[]) => {
  try {
    // 给静态路由添加namePath
    generatorNamePath(constantRoutes)

    const routeList = filterAsyncRoute(asyncMenus)

    // 更新 Layout 路由
    const layout = constantRoutes.find((item: RouteRecordRaw) => item.name === 'Layout')!
    layout.children = layout.children?.concat(routeList)
    const removeRoute = router.addRoute(layout)
    // 获取所有没有包含children的路由，上面addRoute的时候，vue-router已经帮我们拍平了所有路由
    layout.children = router
      .getRoutes()
      .filter((item) => !item.children.length && !outsideLayout.some((n) => n.name === item.name))
    removeRoute()

    router.addRoute(layout)

    return Promise.resolve([...dashboardRoutes, ...routeList])
  } catch (error) {
    return Promise.reject(`生成路由时出错: ${error}`)
  }
}

/**
 * 主要方便于控制a-menu的open-keys，即控制左侧菜单应当展开哪些菜单
 * @param {RouteRecordRaw[]} routes 需要添加namePath的路由
 * @param {string[]} namePath 路径字符串数组
 */
export const generatorNamePath = (
  routes: RouteRecordRaw[],
  namePath?: string[],
  parent?: RouteRecordRaw
) => {
  routes.forEach((item) => {
    if (item.meta && typeof item.name === 'string') {
      item.meta.namePath = Array.isArray(namePath) ? namePath.concat(item.name) : [item.name]
      item.meta.fullPath = parent?.meta?.fullPath
        ? [parent.meta.fullPath, item.path].join('/')
        : item.path
      item.meta.fullPath = uniqueSlash(item.meta.fullPath as string)

      if (item.children?.length) {
        generatorNamePath(item.children, item.meta.namePath as string[], item)
      }
    }
  })
}
