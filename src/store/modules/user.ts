import { defineStore } from 'pinia'
import { store } from '@/store'
import type { RouteRecordRaw } from 'vue-router'
import { Storage } from '@/utils/Storage'
import { ACCESS_TOKEN_KEY } from '@/enums/cacheEnum'
import { login, logout, getUserInfo, getUserPermmenu } from '@/api'
import { resetRouter } from '@/router'
import { generatorDynamicRouter } from '@/router/generatorRouter'

interface UserState {
  token: string
  name: string
  avatar: string
  // like [ 'sys:user:add', 'sys:user:update' ]
  perms: string[]
  menus: RouteRecordRaw[]
  userInfo: Partial<API.UserInfoResult>
}

// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const useUserStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'user',
  // state: 返回对象的函数
  state: (): UserState => ({
    token: Storage.get(ACCESS_TOKEN_KEY, null),
    name: '',
    avatar: '',
    perms: [],
    menus: [],
    userInfo: {},
  }),
  getters: {
    getToken(): string {
      return this.token
    },
    getAvatar(): string {
      return this.avatar
    },
    getName(): string {
      return this.name
    },
    getPerms(): string[] {
      return this.perms
    },
  },
  actions: {
    /** 清空token及用户信息 */
    resetToken() {
      this.avatar = this.token = this.name = ''
      this.perms = []
      this.menus = []
      this.userInfo = {}
      Storage.clear()
    },
    /** 登录成功保存token */
    setToken(token: string) {
      this.token = token ?? ''
      const ex = 7 * 24 * 60 * 60 * 1000
      Storage.set(ACCESS_TOKEN_KEY, this.token, ex)
    },
    /** 登录 */
    async login(params: API.LoginParams) {
      try {
        const { data } = await login(params)
        this.setToken(data.token)
        return this.afterLogin()
      } catch (error) {
        return Promise.reject(error)
      }
    },
    /** 登录成功之后, 获取用户信息以及生成权限路由 */
    async afterLogin() {
      try {
        const [userInfo, { perms, menus }] = await Promise.all([getUserInfo(), getUserPermmenu()])

        this.perms = perms
        this.name = userInfo.name
        this.avatar = userInfo.headImg
        this.userInfo = userInfo

        // 生成路由以及未处理菜单
        this.menus = await generatorDynamicRouter(menus)

        return { menus, perms, userInfo }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    /** 登出 */
    async logout() {
      await logout()
      this.resetToken()
      resetRouter()
    },
  },
})

// 在组件setup函数外使用
export function useUserStoreWithOut() {
  return useUserStore(store)
}
