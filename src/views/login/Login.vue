<template>
  <a-button type="primary" @click="handleClick">Login</a-button>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()
const handleClick = async () => {
  await userStore.login({
    username: 'admin',
    password: '123456',
  })

  router.replace((route.query.redirect as string) ?? '/')
}
</script>
