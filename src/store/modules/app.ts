import { defineStore } from 'pinia'
import { ThemeEnum } from '@/enums/app'
import { Storage } from '@/utils/Storage'
import { THEME_KEY } from '@/enums/cacheEnum'

interface MenuSetting {
  themeColor: string
}

interface HeaderSetting {
  themeColor: string
}

interface AppConfig {
  themeMode?: ThemeEnum
  themeColor: string
  headerSetting: HeaderSetting
  menuSetting: MenuSetting
}

// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const useAppStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'app',
  // state: 返回对象的函数
  state: (): AppConfig => ({
    themeMode: ThemeEnum.LIGHT,
    themeColor: '#F2FDFF',
    headerSetting: {
      themeColor: '#F2FDFF',
    },
    menuSetting: {
      themeColor: '#F2FDFF',
    },
  }),
  actions: {
    toggleThemeMode() {
      if (this.themeMode === ThemeEnum.DARK) {
        this.themeMode = ThemeEnum.LIGHT
        document.body.removeAttribute('data-theme')
        document.documentElement.style.setProperty('--header-bg-color', '#ffffff')
        document.documentElement.style.setProperty('--header-color', '#000000')

        document.documentElement.style.setProperty('--sider-color', '#000000')

        document.documentElement.style.setProperty('--main-bg-color', '#ffffff')
        document.documentElement.style.setProperty('--main-color', '#000000')
      } else {
        this.themeMode = ThemeEnum.DARK
        document.body.setAttribute('data-theme', 'dark')
        document.documentElement.style.setProperty('--header-bg-color', '#17171A')
        document.documentElement.style.setProperty('--header-color', '#ffffff')

        document.documentElement.style.setProperty('--sider-color', '#ffffff')

        document.documentElement.style.setProperty('--main-bg-color', '#000000')
        document.documentElement.style.setProperty('--main-color', '#ffffff')
      }
      Storage.set(THEME_KEY, JSON.stringify(this.$state))
    },
  },
})
