import { successResponseWrap, failResponseWrap } from '../mock'

export default [
  {
    url: '/mock/login',
    method: 'post',
    timeout: 300,
    response: ({ body }) => {
      const { username, password } = body
      if (!username) {
        return failResponseWrap(null, '用户名不能为空', 50000)
      }
      if (!password) {
        return failResponseWrap(null, '密码不能为空', 50000)
      }
      if (username === 'admin' && password === '123456') {
        return successResponseWrap({
          token: 'TOKEN123456789',
        })
      }
      return failResponseWrap(null, '账号或者密码错误', 50000)
    },
  },
  {
    url: '/mock/logout',
    method: 'post',
    timeout: 300,
    response: () => {
      return successResponseWrap(null)
    },
  },
  {
    url: '/mock/sys/user/info',
    method: 'get',
    timeout: 300,
    response: () => {
      return successResponseWrap({
        name: '@cname',
        nickName: '',
        email: '@email',
        phone: '',
        remark: null,
        headImg: 'https://buqiyuan.gitee.io/img/logo.jpg',
        loginIp: '127.0.0.1',
      })
    },
  },
  {
    url: '/mock/sys/user/permmenu',
    method: 'get',
    timeout: 300,
    response: () => {
      return successResponseWrap({
        menus: [
          {
            createdAt: '@datetime',
            updatedAt: '@datetime',
            id: 1,
            parentId: null,
            name: '系统',
            router: '/sys',
            perms: null,
            type: 0,
            icon: null,
            orderNum: 255,
            viewPath: null,
            keepAlive: true,
            isShow: true,
            isExt: false,
            openMode: 1,
          },
          {
            createdAt: '@datetime',
            updatedAt: '@datetime',
            id: 2,
            parentId: 1,
            name: '用户列表',
            router: '/sys/user',
            perms: null,
            type: 1,
            icon: null,
            orderNum: 0,
            viewPath: 'views/sys/UserList',
            keepAlive: true,
            isShow: true,
            isExt: false,
            openMode: 1,
          },
        ],
        perms: ['sys:user:add'],
      })
    },
  },
]
