<template>
  <ConfigProvider>
    <a-button type="primary" @click="handleClick">click</a-button>
    <RouterView />
  </ConfigProvider>
</template>
<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue'
const handleClick = () => {
  ConfigProvider.config({
    theme: {
      primaryColor: '#7bcfa6',
    },
  })
}
</script>
<style lang="less" scoped></style>
