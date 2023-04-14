import { FC, PropsWithChildren } from 'react'
import classes from './index.module.less'

/**
 * 用户登录和注册时的布局信息
 * @param children 子组件
 */
const FormUserLayout: FC<PropsWithChildren> = ({ children }) => {
  return <div className={classes.formUserLayout}>{children}</div>
}

export default FormUserLayout
