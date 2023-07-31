import { useEffect } from 'react';
// @ts-ignore
import { useSignal } from 'react-use-signal';
import FormRender, { useForm } from 'form-render';
import DragMoveContainer from '../base/DragMoveContainer';
import ReactAce from 'react-ace';
import schema from './schema';
// @ts-ignore
import service from '@service';
import './signal';
import './style.css';

const TemplateCreator = () => {
  const [state, setState] = useSignal('template-creator');
  const form = useForm();
  const {
    show,
    icon,
    name,
    dsl
  } = state;

  const onClose = () => {
    setState({ show: false, dsl: [], name: '', icon: '' });
  };

  const onChange = (value) => {
    const { icon, name } = value;
    service('createTemplate', { icon, name, dsl: JSON.stringify(dsl) });
  };

  useEffect(() => {
    const setShow = (props: { show: boolean, [key: string] : any } = {show: true}) => {
      setState(props);
    };
    setState({ setShow });
  }, []);

  if (!show) return null;

  return (
    <DragMoveContainer show={show} title="添加模版" onClose={onClose}>
      <div className='template-creator-container'>
        <div className='template-creator-half-container' style={{ padding: '12px' }}>
          <FormRender footer form={form} schema={schema} column={2} onFinish={onChange} />
        </div>
        <div className='template-creator-half-container'>
          <ReactAce
            mode="json" // 设置编辑器的模式为JavaScript
            theme="chrome" // 设置编辑器的主题
            readOnly
            enableBasicAutocompletion // 启用基本的自动完成
            enableLiveAutocompletion // 启用实时自动完成
            enableSnippets // 启用代码片段
            tabSize={2} // 设置缩进为2个空格
            setOptions={{
              useWorker: false // 禁用worker，以支持JSX代码的提示和补全
            }}
            value={JSON.stringify(dsl, null, 2)}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </DragMoveContainer>
  );
};

export default TemplateCreator;