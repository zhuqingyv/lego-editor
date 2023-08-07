import { useEffect } from 'react';
// @ts-ignore
import { useSignal } from 'react-use-signal';
import FormRender, { useForm } from 'form-render';
import DragMoveContainer from '../base/DragMoveContainer';
import { toast, TypeEnum } from '../Toast';
import ReactAce from 'react-ace';
import schema from './schema';
// @ts-ignore
import service from '@service';
import './signal';
import './style.css';

const TemplateCreator = () => {
  const [state, setState] = useSignal('template-creator');
  const [api] = useSignal('app', 'api');
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

  const onChange = async(value: any) => {
    const { icon, name } = value;
    toast('新增模版中...', TypeEnum.LOADING);
    await setState({ show: false, dsl: [],icon: '', name: ''});
    await service('createTemplate', { icon, name, dsl: JSON.stringify(dsl) });
    toast('刷新模版列表中...', TypeEnum.LOADING);
    await api.allTemplate();
    toast('新增模版成功', TypeEnum.SUCCESS);
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
          <FormRender
            footer
            form={form}
            schema={schema({ title: `${Date.now()}`, icon })}
            column={2}
            onFinish={onChange}
          />
          <div className='template-creator-preview-image-container'>
            <img className='template-creator-preview-image' src={icon} />
          </div>
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