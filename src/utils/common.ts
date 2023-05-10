/**
 * / _ - 转换成驼峰
 * @param {*} name name
 */
export const toHump = (name: string) => {
  return name.replace(/[-/_](\w)/g, (_, letter) => {
    return letter.toUpperCase()
  })
}
