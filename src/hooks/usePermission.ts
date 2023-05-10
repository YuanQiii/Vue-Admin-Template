import { useUserStore } from '@/store/modules/user'

export function usePermission() {
  /**
   * 验证权限
   * @param {string} perm  权限码
   * @returns {boolean} true | false
   */
  const hasPermission = (perm: string) => {
    return useUserStore().perms.some((n) => n === perm)
  }
  return { hasPermission }
}
