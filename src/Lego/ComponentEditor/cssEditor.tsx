import { useRef } from 'react';
import ReactAce from 'react-ace';
// @ts-ignore
import { useSignal } from 'react-use-signal';

const CssEditor = ({ onChange }: any) => {
  const [currentMaterial] = useSignal('app', 'currentMaterial');
  const timer = useRef() as any;
  const { cssCode } = currentMaterial;

  const _onChange = (newCode: string) => {
    const { current } = timer;
    if (current) clearTimeout(current);

    timer.current = setTimeout(() => {
      onChange({ type: 'css', value: newCode });
    }, 6000);
  };

  return (
    <ReactAce
      mode="css" // 设置编辑器的模式为JavaScript
      theme="chrome" // 设置编辑器的主题
      enableBasicAutocompletion // 启用基本的自动完成
      enableLiveAutocompletion // 启用实时自动完成
      enableSnippets // 启用代码片段
      tabSize={2} // 设置缩进为2个空格
      setOptions={{
        useWorker: false // 禁用worker，以支持JSX代码的提示和补全
      }}
      value={cssCode}
      onChange={_onChange}
      style={{ width: '100%', height: '100%' }}
    />
  )
};

export default CssEditor;