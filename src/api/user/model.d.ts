declare namespace API {
  /** 登录参数 */
  type LoginParams = {
    password: string
    username: string
  }

  /** 登录成功结果 */
  type LoginResult = {
    token: string
  }

  type UserInfoResult = {
    createTime: Date
    updateTime: Date
    id: number
    departmentId: number
    name: string
    username: string
    password: string
    psalt: string
    nickName: string
    headImg: string
    loginIp: string
    email: string
    phone: string
    remark: string
    status: number
    roles: number[]
    departmentName: string
  }

  type UserPermMenuResult = {
    menus: Menu[]
    perms: string[]
  }

  type UserMenu = {
    createTime: Date
    updateTime: Date
    id: number
    parentId: number
    name: string
    // 菜单路径
    router: string
    perms: string
    /** 当前菜单类型 0: 目录 | 1: 菜单 | 2: 权限 */
    type: 0 | 1 | 2
    icon: string
    orderNum: number
    viewPath: string
    keepAlive: boolean
    isShow: boolean
    /** 是否外链 */
    isExt?: boolean
    /** 外链打开方式
     * 1: 新窗口打开
     * 2: iframe
     */
    openMode?: 1 | 2
  }
}
