export const LOGIN_NAME = 'Login'

export const REDIRECT_NAME = 'Redirect'

export const PAGE_NOT_FOUND_NAME = 'PageNotFound'

// 路由白名单
export const whiteNameList = [LOGIN_NAME, 'error'] as const // no redirect whitelist

export type WhiteNameList = typeof whiteNameList
