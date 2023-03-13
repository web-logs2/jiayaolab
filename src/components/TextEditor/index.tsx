import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import '@wangeditor/editor/dist/css/style.css'
import { FC, useEffect, useState } from 'react'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { setContentDraft } from '../../store/features/postDraftSlice'
import classes from './index.module.less'

/**
 * 富文本编辑器
 * @param loading 是否正在加载中
 * @param onChange 当编辑器的内容发生变化时调用
 */
const TextEditor: FC<{
  loading: boolean
  onChange: (newValue: string) => void
}> = ({ loading, onChange }) => {
  const dispatch = useAppDispatch()
  const [editor, setEditor] = useState<IDomEditor | null>(null)
  const [onChangeLocked, setOnChangeLocked] = useState<boolean>(true)
  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: [
      'fontFamily',
      'fontSize',
      'lineHeight',
      'emotion',
      'uploadImage',
      'uploadVideo',
      'fullScreen',
    ],
  }
  const editorConfig: Partial<IEditorConfig> = {
    maxLength: 30000,
    autoFocus: false,
    scroll: false,
    placeholder: '内容（必填）',
  }
  const { textContent, htmlContent } = useTypedSelector(s => s.postDraftSlice)

  // 页面切换后销毁编辑器
  useEffect(
    () => () => {
      if (editor) {
        editor.destroy()
        setEditor(null)
      }
    },
    [editor]
  )
  // 当编辑器的内容发生变化时调用
  useEffect(() => {
    // 编辑器首次发生变化时不调用
    if (!onChangeLocked) {
      onChange(textContent)
    }
    onChangeLocked && setOnChangeLocked(false)
  }, [textContent])
  // 在加载中的时候禁用编辑器
  useEffect(() => {
    if (editor) {
      loading ? editor.disable() : editor.enable()
    }
  }, [editor, loading])
  return (
    <div className={classes.textEditor}>
      <Toolbar
        className={classes.toolbar}
        editor={editor}
        defaultConfig={toolbarConfig}
      />
      <Editor
        className={classes.editor}
        defaultConfig={editorConfig}
        value={htmlContent}
        onCreated={setEditor}
        onChange={({ getText, getHtml }) =>
          dispatch(
            setContentDraft({
              textContent: getText(),
              htmlContent: getHtml(),
            })
          )
        }
      />
    </div>
  )
}

export default TextEditor
