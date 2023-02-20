import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import '@wangeditor/editor/dist/css/style.css'
import { FC, useEffect, useState } from 'react'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { addContentDraft } from '../../store/features/articleSlice'
import classes from './index.module.less'

/**
 * 富文本编辑器
 * @param pushing 是否正在发布中
 * @param onValidateHandler 验证处理程序
 */
const TextEditor: FC<{
  pushing: boolean
  onValidateHandler: () => void
}> = ({ pushing, onValidateHandler }) => {
  const dispatch = useAppDispatch()
  const [editor, setEditor] = useState<IDomEditor | null>(null)
  // 验证锁，取消第一次载入执行验证函数
  const [locked, setLocked] = useState<boolean>(true)
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
    placeholder: '内容（必填）',
  }
  const { text, html } = useTypedSelector(s => s.articleSlice)

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
  useEffect(() => {
    if (!locked) {
      onValidateHandler()
    }
    locked && setLocked(false)
  }, [text])
  useEffect(() => {
    if (pushing) {
      editor?.disable()
    } else {
      editor?.enable()
    }
  }, [editor, pushing])
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
        value={html}
        onCreated={setEditor}
        onChange={e =>
          dispatch(addContentDraft({ text: e.getText(), html: e.getHtml() }))
        }
      />
    </div>
  )
}

export default TextEditor
