// @ts-ignore
import DragAble from './DragAble';
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
      await service('deleteTemplate', { id }).then(() => toast('删除成功!', TypeEnum.SUCCESS));
      window.location.reload();
    };
  };

  return (
    <div className="ComponentStore-container">
      <div style={{ flex: 1 }}>
        <div className='ComponentStore-list-container'>
          {/* 基础组件 */}
          {
            !!isDev && material.map((item, index) => {
              const { schema, name, id } = item;
              return (
                <DragAble
                  key={`component_store_${item.name}`}
                  data-component={JSON.stringify({ schema, name, id })}
                  item={item}
                  index={index}
                  onClick={onClick}
                />
              )
            })
          }
          {/* 模版组件 */}
          {
            (!!allTemplate?.length) && allTemplate.map((template: any = {}, index: number) => {
              const { id, dsl, name, path, type } = template;
              return (
                <DragAble
                  key={`component_store_template_${name}`}
                  data-component={JSON.stringify({ dsl, name, id, path, type })}
                  item={template}
                  index={index}
                  onDelete={onDeleteTemplate}
                />
              );
            })
          }
        </div>
      </div>
      { children }
    </div>
  )
};

export default ComponentStore;