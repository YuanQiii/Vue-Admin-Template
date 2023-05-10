import type { RouteRecordRaw } from 'vue-router'
import RouterView from '@/layout/routerView/index.vue'

// 默认布局
export const Layout = () => import('@/layout/index.vue')

export const dashboardRoutes: Array<RouteRecordRaw> = [
  {
    path: 'dashboard',
    name: 'Dashboard',
    redirect: '/dashboard/analysis',
    component: RouterView,
    meta: { title: '仪表盘', isShow: true },
    children: [
      {
        path: '/dashboard/analysis',
        name: 'DashboardAnalysis',
        component: () => import('@/views/dashboard/analysis/Analysis.vue'),
        meta: { title: '分析页', isShow: true, keepAlive: true },
      },
      {
        path: '/dashboard/workplace',
        name: 'DashboardWorkplace',
        component: () => import('@/views/dashboard/workplace/Workplace.vue'),
        meta: { title: '工作台', isShow: true, keepAlive: true },
      },
    ],
  },
]

// 静态路由 无需验证权限
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    meta: { title: '', hideChildrenInMenu: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/Redirect.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue'),
    meta: { title: '登录页', keepAlive: false },
  },
  {
    path: '/404',
    name: 'Error',
    component: () => import('@/views/error/Error.vue'),
    meta: { title: '404页', hideChildrenInMenu: true },
  },
  {
    path: '',
    component: Layout,
    name: 'Layout',
    redirect: '/dashboard/analysis',
    meta: { title: '布局' },
    children: dashboardRoutes,
  },
]
