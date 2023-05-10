<template>
  <div class="text-white">Header</div>
  <a-button type="primary" @click="handleClick">Logout</a-button>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
const handleClick = async () => {
  await userStore.logout()
}
</script>
