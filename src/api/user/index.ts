import type { BaseResponse } from '@/utils/request'
import { request } from '@/utils/request'

export function login(data: API.LoginParams) {
  return request<BaseResponse<API.LoginResult>>(
    {
      url: 'login',
      method: 'post',
      data,
    },
    {
      isGetDataDirectly: false,
    }
  )
}

export function logout() {
  return request({
    url: 'logout',
    method: 'post',
  })
}

export function getUserInfo() {
  return request<API.UserInfoResult>({
    url: 'sys/user/info',
    method: 'get',
  })
}

export function getUserPermmenu() {
  return request<API.UserPermMenuResult>({
    url: 'sys/user/permmenu',
    method: 'get',
  })
}
