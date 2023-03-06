import { FC } from 'react'
import { Helmet } from 'react-helmet-async'

/**
 * 修改网页title标签
 * @param layers 网页Title标签内容数组，自动用-符号分隔
 */
const HeadTitle: FC<{ layers?: (string | null | undefined)[] }> = ({
  layers,
}) => (
  <Helmet>
    <title>
      {layers ? `${layers.filter(Boolean).join('-')}-` : ''}佳垚的论坛
    </title>
  </Helmet>
)

export default HeadTitle
