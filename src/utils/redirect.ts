/**
 * 链接重定向
 * @param to 前往的路径
 * @param redirect 重定向路径
 */
export const urlRedirect = (to: string, redirect: string) => {
  return `${to}?redirect=${redirect}`
}
