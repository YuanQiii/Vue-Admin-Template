<template>
  <div>UserList</div>
  <a-button v-if="hasPermission('sys:user:add')" type="primary">Primary Button</a-button>
</template>

<script lang="ts" setup name="UserList">
import { usePermission } from '@/hooks/usePermission'
const { hasPermission } = usePermission()
console.log(123)
</script>
