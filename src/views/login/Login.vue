<template>
  <SvgIcon name="logo" />
  <a-button type="primary" @click="handleClick">Login</a-button>
  <img src="@/assets/images/Grand Theft Auto V 03.25.2017 - 16.19.56.05.jpg" alt="" />
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import SvgIcon from '@/components/basic/SvgIcon.vue'

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
