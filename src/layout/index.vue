<template>
  <a-layout class="flex h-100vh overflow-hidden">
    <a-layout-sider :theme="appStore.themeMode">
      <Logo />
      <Menu />
    </a-layout-sider>
    <a-layout>
      <a-layout-header><Header /></a-layout-header>
      <a-layout-content>
        <router-view v-slot="{ Component, route }">
          <keep-alive :include="keepAliveComponents">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import Menu from './menu/Menu.vue'
import Logo from './logo/Logo.vue'
import Header from './header/Header.vue'

import { useAppStore } from '@/store/modules/app'

import { useKeepAliveStore } from '@/store/modules/keepAlive'

const appStore = useAppStore()
const keepAliveStore = useKeepAliveStore()
// 缓存的路由组件列表
const keepAliveComponents = computed(() => keepAliveStore.list)
</script>
