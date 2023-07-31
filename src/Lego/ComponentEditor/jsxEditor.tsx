import ReactAce from 'react-ace';

const JsxEditor = ({ onChange, currentMaterial }:any) => {
  const { editorViewCode } = currentMaterial;

  const _onChange = (newCode: string) => {
    onChange({ type: 'jsx', value: newCode });
  };

  return (
    <ReactAce
      mode="jsx" // 设置编辑器的模式为JavaScript
      theme="chrome" // 设置编辑器的主题
      enableBasicAutocompletion // 启用基本的自动完成
      enableLiveAutocompletion // 启用实时自动完成
      enableSnippets // 启用代码片段
      tabSize={2} // 设置缩进为2个空格
      setOptions={{
        useWorker: true // 禁用worker，以支持JSX代码的提示和补全
      }}
      value={editorViewCode}
      onChange={_onChange}
      style={{ width: '100%', height: '100%' }}
      showGutter
    />
  )
};

export default JsxEditor;