import DragAble from './DragAble';
import Templates from './Templates';
import Components from './Components';
// @ts-ignore
import { useSignal } from 'react-use-signal';
import { toast, TypeEnum } from '../Toast';
// @ts-ignore
import service from '@service';
import './style.css';

const setMaterial = (material: any) => {
  return Object.keys(material).map((key) => material[key]);
};

const ComponentStore = ({ children }:any) => {
  const [isDev] = useSignal('app', 'isDev');
  const [getAllTemplate] = useSignal('app', 'api.allTemplate');
  const [materialObject] = useSignal('app', 'material');
  const [allTemplate = []] = useSignal('app', 'allTemplate');
  const [_, setState] = useSignal('app', );

  const material = setMaterial(materialObject);

  const onClick = (item: any, event: any) => {
    event.preventDefault();
    if (isDev) {
      setState({ currentMaterial: item });
    };
  };

  const onDeleteTemplate = async(event: any) => {
    if (confirm('确定要删除么?')) {
      const { item } = event;
      const { id } = item;
      toast('正在删除', TypeEnum.LOADING);
      await service('deleteTemplate', { id });
      await getAllTemplate();
      toast('删除成功!', TypeEnum.SUCCESS);
    };
  };

  return (
    <div className="ComponentStore-container">
      <div style={{ flex: 1, overflow: 'scroll' }}>
        <Components isDev={isDev} material={material} onClick={onClick} />
        <Templates allTemplate={allTemplate} onDeleteTemplate={onDeleteTemplate} />
      </div>
      { children }
    </div>
  )
};

export default ComponentStore;