import { FC, PropsWithChildren } from 'react'
import classes from './index.module.less'

const FormUserLayout: FC<PropsWithChildren> = ({ children }) => {
  return <div className={classes.formUserLayout}>{children}</div>
}

export default FormUserLayout
