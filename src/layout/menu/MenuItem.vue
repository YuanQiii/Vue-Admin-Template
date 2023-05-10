<template>
  <template v-for="item in filterMenus" :key="item.name || item.fullPath">
    <!-- 目录 -->
    <template v-if="isShowSubMenu(item)">
      <a-sub-menu :key="item?.name" v-bind="$attrs">
        <template #title> {{ item.meta?.title }}</template>
        <template v-if="item.children">
          <!-- 递归生成菜单 -->
          <MenuItem :menus="item.children" />
        </template>
      </a-sub-menu>
    </template>
    <!-- 菜单 -->
    <template v-else>
      <a-menu-item :key="item?.name"> {{ item.meta?.title }}</a-menu-item>
    </template>
  </template>
</template>

<script setup lang="ts">
import { type PropType, computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const props = defineProps({
  menus: {
    type: Array as PropType<RouteRecordRaw[]>,
    default: () => [],
  },
})

const filterMenus = computed(() => {
  return [...props.menus]
    .filter((item) => item.meta?.isShow)
    .sort((a, b) => ((a?.meta?.orderNum as number) || 0) - ((b?.meta?.orderNum as number) || 0))
})

const isShowSubMenu = (menuItem: RouteRecordRaw) => {
  return (
    menuItem?.meta?.type === 0 ||
    (!Object.is(menuItem?.meta?.hideChildrenInMenu, true) && menuItem?.children?.length)
  )
}
</script>
