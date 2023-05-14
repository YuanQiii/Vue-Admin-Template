<template>
  <span>Header</span>
  <a-button type="primary" @click="handleLogout">Logout</a-button>
  <a-button type="primary" @click="handleToggleTheme">Toggle</a-button>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

const handleToggleTheme = () => {
  appStore.toggleThemeMode()
}
const userStore = useUserStore()
const handleLogout = async () => {
  await userStore.logout()
}
</script>

<style lang="less">
.ant-layout-header {
  color: @header-color;
  background-color: @header-bg-color;
  transition: 0.5s;
}
</style>
