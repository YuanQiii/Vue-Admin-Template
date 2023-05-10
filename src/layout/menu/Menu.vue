<template>
  <div class="menu-container">
    <Menu
      v-model:selected-keys="state.selectedKeys"
      :open-keys="state.openKeys"
      :mode="'inline'"
      collapsible
      theme="dark"
      @click="clickMenuItem"
    >
      <MenuItem :menus="menus" />
    </Menu>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu } from 'ant-design-vue'
import MenuItem from './MenuItem.vue'
import { useUserStore } from '@/store/modules/user'
import { LOGIN_NAME } from '@/router/constant'
import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface'

const userStore = useUserStore()
// 当前路由
const currentRoute = useRoute()

const router = useRouter()
const state = reactive({
  openKeys: [] as string[],
  selectedKeys: [currentRoute.name] as string[],
})

const menus = computed(() => userStore.menus)

const getRouteByName = (name: string) => router.getRoutes().find((n) => n.name === name)

// 获取当前打开的子菜单
const getOpenKeys = (): string[] => {
  return (currentRoute.meta?.namePath ??
    currentRoute.matched.slice(1).map((n) => n.name)) as string[]
}

// 跟随页面路由变化，切换菜单选中状态
watchEffect(() => {
  if (currentRoute.name === LOGIN_NAME) {
    return
  }
  state.openKeys = getOpenKeys()
  state.selectedKeys = [currentRoute.name] as string[]
})

// 点击菜单
const clickMenuItem = (e: MenuInfo) => {
  const key = e.key as string
  if (typeof key === 'string') {
    if (key === currentRoute.name) {
      return
    }
    const targetRoute = getRouteByName(key)
    const { isExt, openMode } = targetRoute?.meta || {}
    if (isExt && openMode !== 2) {
      window.open(key)
    } else {
      router.push({ name: key })
    }
  }
}
</script>

<style lang="less" scoped>
.menu-container {
  overflow: auto;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
</style>
