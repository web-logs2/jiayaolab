import { FC } from 'react'
import { Helmet } from 'react-helmet-async'

/**
 * 修改网页title标签
 * @param name 网页Title标签内容
 */
const HeadTitle: FC<{ prefix?: string }> = ({ prefix }) => (
  <Helmet>
    <title>{prefix ? `${prefix}-` : ''}佳垚的论坛</title>
  </Helmet>
)

export default HeadTitle
