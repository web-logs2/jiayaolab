import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import '@wangeditor/editor/dist/css/style.css'
import { FC, useEffect, useState } from 'react'
import { useAppDispatch, useTypedSelector } from '../../hook'
import { addContentDraft } from '../../store/features/draftSlice'
import classes from './index.module.less'

const TextEditor: FC<{ onValidateHandler: () => void }> = ({
  onValidateHandler,
}) => {
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
    placeholder: '内容（必填）',
    maxLength: 30000,
  }
  const { text, html } = useTypedSelector(s => s.draftSlice)

  // 切换页面后销毁编辑器
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
  return (
    <div className={classes.wrapper}>
      <Toolbar
        className={classes.toolbarWrapper}
        editor={editor}
        defaultConfig={toolbarConfig}
      />
      <Editor
        className={classes.editorWrapper}
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
