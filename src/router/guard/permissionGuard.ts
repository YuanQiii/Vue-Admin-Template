import { isNavigationFailure } from 'vue-router'
import NProgress from 'nprogress' // progress bar
import { LOGIN_NAME, REDIRECT_NAME } from '../constant'
import type { WhiteNameList } from '../constant'
import type { Router, RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useKeepAliveStore } from '@/store/modules/keepAlive'
import { ACCESS_TOKEN_KEY } from '@/enums/cacheEnum'
import { Storage } from '@/utils/Storage'
import { to as _to } from '@/utils/awaitTo'
import { message as $message } from 'ant-design-vue'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const defaultRoutePath = '/dashboard/analysis'

export function createPermissionGuard(router: Router, whiteNameList: WhiteNameList) {
  router.beforeEach(async (to, _, next) => {
    NProgress.start() // start progress bar
    const userStore = useUserStore()
    const token = Storage.get(ACCESS_TOKEN_KEY, null)

    if (token) {
      if (to.name === LOGIN_NAME) {
        next({ path: defaultRoutePath })
      } else {
        const hasRoute = router.hasRoute(to.name!)
        if (userStore.menus.length === 0) {
          // 从后台获取菜单
          const [err] = await _to(userStore.afterLogin())
          if (err) {
            userStore.resetToken()
            return next({ name: LOGIN_NAME })
          }
          if (!hasRoute) {
            // 如果该路由不存在，可能是动态注册的路由，它还没准备好，需要再重定向一次到该路由
            next({ ...to, replace: true })
          } else {
            next()
          }
        } else {
          next()
        }
      }
    } else if (whiteNameList.some((n) => n === to.name)) {
      // 在免登录名单，直接进入
      next()
    } else {
      next({ name: LOGIN_NAME, query: { redirect: to.fullPath }, replace: true })
    }
  })

  /** 获取路由对应的组件名称 */
  const getComponentName = (route: RouteLocationNormalized) => {
    return route.matched.at(-1)?.name as string
  }

  router.afterEach((to, from, failure) => {
    const keepAliveStore = useKeepAliveStore()
    const token = Storage.get(ACCESS_TOKEN_KEY, null)

    if (isNavigationFailure(failure)) {
      $message.error(`failed navigation - ${failure}`)
    }

    // 在这里设置需要缓存的组件名称
    const toCompName = getComponentName(to)

    // 判断当前页面是否开启缓存，如果开启，则将当前页面的 componentName 信息存入 keep-alive 全局状态
    if (to.meta?.keepAlive) {
      // 需要缓存的组件
      if (toCompName) {
        keepAliveStore.add(toCompName)
      } else {
        $message.warning(
          `${to.fullPath}页面组件的keepAlive为true但未设置组件名，会导致缓存失效，请检查`
        )
      }
    } else if (toCompName) {
      // 不需要缓存的组件
      keepAliveStore.remove(toCompName)
    }

    // 如果进入的是 Redirect 页面，则也将离开页面的缓存清空(刷新页面的操作)
    if (to.name === REDIRECT_NAME) {
      const fromCompName = getComponentName(from)
      fromCompName && keepAliveStore.remove(fromCompName)
    }
    // 如果用户已登出，则清空所有缓存的组件
    if (!token) {
      keepAliveStore.clear()
    }
    NProgress.done() // finish progress bar
    $message.success('hello world')
  })

  router.onError((error) => {
    $message.warning(`路由错误 - ${error}`)
  })
}
