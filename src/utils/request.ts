import axios from 'axios'
import { message as $message } from 'ant-design-vue'
import type { AxiosRequestConfig } from 'axios'
import { ACCESS_TOKEN_KEY } from '@/enums/cacheEnum'
import { Storage } from '@/utils/Storage'
import { useUserStore } from '@/store/modules/user'
import { uniqueSlash } from '@/utils/urlUtils'

export interface RequestOptions {
  /** 当前接口权限, 不需要鉴权的接口请忽略， 格式：sys:user:add */
  permCode?: string
  /** 是否直接获取data，而忽略message等 */
  isGetDataDirectly?: boolean
  /** 请求成功是提示信息 */
  successMsg?: string
  /** 请求失败是提示信息 */
  errorMsg?: string
  /** 是否mock数据请求 */
  isMock?: boolean
}

const UNKNOWN_ERROR = '未知错误，请重试'

/** 真实请求的路径前缀 */
const baseApiUrl = import.meta.env.VITE_BASE_API
/** mock请求路径前缀 */
const baseMockUrl = import.meta.env.VITE_MOCK_API

const service = axios.create({
  timeout: 6000,
})

const pendingMap = new Map()

/**
 * 生成每个请求唯一的键
 * @param {*} config
 * @returns string
 */
function getPendingKey(config: AxiosRequestConfig) {
  let { data } = config
  const { url, method, params } = config
  if (typeof data === 'string') {
    data = JSON.parse(data)
  } // response里面返回的config.data是个字符串对象
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}

/**
 * 储存每个请求唯一值, 也就是cancel()方法, 用于取消请求
 * @param {*} config
 */
function addPending(config: AxiosRequestConfig) {
  const pendingKey = getPendingKey(config)
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, cancel)
      }
    })
}

/**
 * 删除重复的请求
 * @param {*} config
 */
function removePending(config: AxiosRequestConfig) {
  const pendingKey = getPendingKey(config)
  if (pendingMap.has(pendingKey)) {
    const cancelToken = pendingMap.get(pendingKey)
    cancelToken(pendingKey)
    pendingMap.delete(pendingKey)
  }
}

// 请求拦截
service.interceptors.request.use(
  (config) => {
    // 取消重复请求
    removePending(config)
    addPending(config)

    const token = Storage.get(ACCESS_TOKEN_KEY)
    if (token && config.headers) {
      // 请求头token信息，请根据实际情况进行修改
      config.headers.Authorization = token
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  (response) => {
    removePending(response.config)

    const res = response.data

    // if the custom code is not 200, it is judged as an error.
    if (res.code !== 200) {
      let message = ''
      switch (res.code) {
        case 302:
          message = '接口重定向了！'
          break
        case 400:
          message = '参数不正确！'
          break
        case 401:
          message = '您未登录，或者登录已经超时，请先登录！'
          break
        case 403:
          message = '您没有权限操作！'
          break
        case 404:
          message = `请求地址出错: ${response.config.url}`
          break // 在正确域名下
        case 408:
          message = '请求超时！'
          break
        case 409:
          message = '系统已存在相同数据！'
          break
        case 500:
          message = '服务器内部错误！'
          break
        case 501:
          message = '服务未实现！'
          break
        case 502:
          message = '网关错误！'
          break
        case 503:
          message = '服务不可用！'
          break
        case 504:
          message = '服务暂时无法访问，请稍后再试！'
          break
        case 505:
          message = 'HTTP版本不受支持！'
          break
        default:
          message = res.message
          break
      }
      $message.error(message || UNKNOWN_ERROR)

      // Illegal token
      if (res.code === 11001 || res.code === 11002) {
        window.localStorage.clear()
        window.location.reload()
      }

      // throw other
      const error = new Error(res.message || UNKNOWN_ERROR) as Error & { code: any }
      error.code = res.code
      return Promise.reject(error)
    }
    return res
  },
  (error) => {
    // 处理 422 或者 500 的错误异常提示
    const errMsg = error?.response?.data?.message ?? UNKNOWN_ERROR
    $message.error(errMsg)
    error.message = errMsg
    return Promise.reject(error)
  }
)

export type Response<T = any> = {
  code: number
  message: string
  data: T
}

export type BaseResponse<T = any> = Promise<Response<T>>

/**
 *
 * @param method - request methods
 * @param url - request url
 * @param data - request data or params
 */
export const request = async <T = any>(
  config: AxiosRequestConfig,
  options: RequestOptions = {}
): Promise<T> => {
  try {
    const { successMsg, errorMsg, permCode, isMock, isGetDataDirectly = true } = options
    // 如果当前是需要鉴权的接口 并且没有权限的话 则终止请求发起
    if (permCode && !useUserStore().perms.includes(permCode)) {
      return $message.error('你没有访问该接口的权限，请联系管理员！')
    }
    const fullUrl = `${(isMock ? baseMockUrl : baseApiUrl) + config.url}`
    config.url = uniqueSlash(fullUrl)

    const res = await service.request(config)
    successMsg && $message.success(successMsg)
    errorMsg && $message.error(errorMsg)
    return isGetDataDirectly ? res.data : res
  } catch (error: any) {
    return Promise.reject(error)
  }
}
