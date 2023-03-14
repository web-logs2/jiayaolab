import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import '@wangeditor/editor/dist/css/style.css'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import classes from './index.module.less'

const TextEditor: FC<{
  disabled: boolean
  textState: [string, Dispatch<SetStateAction<string>>]
  htmlState: [string, Dispatch<SetStateAction<string>>]
  onChange: (value: string) => void
}> = ({ disabled, textState, htmlState, onChange }) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null)
  const [textContent, setTextContent] = textState
  // HTML格式内容
  const [htmlContent, setHtmlContent] = htmlState
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
  // 在加载中的时候禁用编辑器
  useEffect(() => {
    if (editor) {
      disabled ? editor.disable() : editor.enable()
    }
  }, [editor, disabled])
  // 当内容发生改变时调用onChange回调
  useEffect(() => {
    if (editor) {
      onChange(editor.getText())
    }
  }, [textContent])
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
        onChange={({ getText, getHtml }) => {
          // 编辑器内容改变时调用
          setTextContent(getText())
          setHtmlContent(getHtml())
        }}
      />
    </div>
  )
}

export default TextEditor
